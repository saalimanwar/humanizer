const SYSTEM_PROMPT = `You are a writing editor. Humanize AI-generated text.

REMOVE: "testament", "pivotal moment", "evolving landscape", "groundbreaking",
"nestled", "vibrant", "Furthermore", "Moreover", "In conclusion",
"serves as", "stands as", "functions as", chatbot phrases like "Great question!"

REWRITE with: varied sentence length, opinions, specific details, natural voice.

OUTPUT FORMAT:
<humanized>
[rewritten text only]
</humanized>

<changes>
[bullet list of what changed]
</changes>`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server' });

  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'No text provided' });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: `Humanize this:\n\n${text}` }] }],
      generationConfig: { maxOutputTokens: 2048, temperature: 0.9 }
    }),
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return res.status(upstream.status).json({ error: err.error?.message || 'Gemini error' });
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
        const chunk = evt.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunk) {
          res.write(`data: ${JSON.stringify({ type: 'content_block_delta', delta: { type: 'text_delta', text: chunk } })}\n\n`);
        }
      } catch {}
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
}