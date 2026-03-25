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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server' });

  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'No text provided' });

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2048,
        temperature: 0.9,
        stream: true,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Humanize this text:\n\n${text}` }
        ]
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}));
      return res.status(upstream.status).json({
        error: err.error?.message || `Groq error ${upstream.status}`
      });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

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
          const chunk = evt.choices?.[0]?.delta?.content;
          if (chunk) {
            // Emit in same format the frontend expects
            const out = JSON.stringify({
              type: 'content_block_delta',
              delta: { type: 'text_delta', text: chunk }
            });
            res.write(`data: ${out}\n\n`);
          }
        } catch {}
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    } else {
      res.end();
    }
  }
}