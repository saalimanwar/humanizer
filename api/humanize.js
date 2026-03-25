export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `You are a writing editor. Your job is to humanize AI-generated text by removing AI writing patterns and injecting genuine voice and personality.

You will rewrite the given text and then list what changed.

CRITICAL PATTERNS TO FIX:
1. Remove significance inflation: "testament", "pivotal moment", "evolving landscape", "vital role", "underscores", "highlights"
2. Remove promotional language: "groundbreaking", "nestled", "vibrant", "breathtaking", "stunning", "renowned"
3. Remove superficial -ing phrases: "symbolizing...", "reflecting...", "contributing to...", "showcasing..."
4. Remove vague attributions: "Experts argue", "Industry observers", "Studies show"
5. Remove copula avoidance: replace "serves as", "functions as", "stands as" with "is"/"are"
6. Remove the rule of three and synonym cycling
7. Remove chatbot artifacts: "Great question!", "I hope this helps!", "Let me know if..."
8. Remove generic positive conclusions: "the future looks bright", "exciting times lie ahead"
9. Remove excessive hedging and filler phrases
10. Remove em dashes unless genuinely needed
11. Remove hollow transitions: "Furthermore", "Moreover", "In conclusion", "It is important to note"

PERSONALITY RULES:
- Vary sentence length. Short punchy sentences. Then longer ones.
- Have opinions. React to things.
- Be specific. Replace vague claims with concrete details.
- Use "I" when appropriate.
- Let some mess in. Perfect structure feels algorithmic.

OUTPUT FORMAT — use these exact XML tags:
<humanized>
[the rewritten text only, no commentary]
</humanized>

<changes>
[a plain bulleted list of what you changed and why, keep it short]
</changes>`;

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await req.json();
  const { text } = body;

  if (!text || !text.trim()) {
    return new Response(JSON.stringify({ error: 'No text provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Gemini 2.0 Flash — free tier, fast, great quality
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

  const geminiBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: `Humanize this text:\n\n${text}` }]
      }
    ],
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.9,
    }
  };

  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geminiBody),
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return new Response(
      JSON.stringify({ error: err.error?.message || `Gemini error ${upstream.status}` }),
      { status: upstream.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Transform Gemini SSE → Anthropic-compatible SSE so the frontend works unchanged
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  (async () => {
    const reader = upstream.body.getReader();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;

          try {
            const evt = JSON.parse(data);
            const text = evt.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              // Emit in Anthropic SSE format so frontend JS needs zero changes
              const anthropicEvt = JSON.stringify({
                type: 'content_block_delta',
                delta: { type: 'text_delta', text }
              });
              await writer.write(encoder.encode(`data: ${anthropicEvt}\n\n`));
            }
          } catch {}
        }
      }
    } finally {
      await writer.write(encoder.encode('data: [DONE]\n\n'));
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
