/* global process */
// Vercel serverless function: gives Avani real AI replies.
// The API key lives only in the Vercel environment variable GEMINI_API_KEY.

const SYSTEM =
  "You are Avani, a friendly voice assistant for the On-Ground.ai call centre. " +
  "Reply in one or two short spoken sentences. Help with billing questions, plan upgrades, " +
  "and callback scheduling. If you do not know something, offer a callback from a human agent.";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "AI key is not configured" });
  }

  const incoming = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const contents = incoming
    .slice(-10)
    .filter((m) => m && (m.role === "user" || m.role === "model") && typeof m.text === "string")
    .map((m) => ({ role: m.role, parts: [{ text: m.text.slice(0, 500) }] }));

  if (contents.length === 0 || contents[0].role !== "user") {
    return res.status(400).json({ error: "Conversation must start with a user message" });
  }

  const models = process.env.GEMINI_MODEL
    ? [process.env.GEMINI_MODEL]
    : ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash"];

  const errors = [];
  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          signal: AbortSignal.timeout(8000),
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM }] },
            contents,
            generationConfig: { maxOutputTokens: 400 },
          }),
        }
      );
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("")
        .trim();
      if (response.ok && text) {
        return res.status(200).json({ reply: text, model });
      }
      errors.push(`${model}: ${data?.error?.message || "empty reply"}`);
    } catch (error) {
      errors.push(`${model}: ${error.message}`);
    }
  }
  return res.status(502).json({ error: "AI request failed", details: errors });
}
