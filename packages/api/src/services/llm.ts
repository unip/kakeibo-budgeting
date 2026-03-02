import type { ParseResponse } from "@kakeibo/shared";

const SYSTEM_PROMPT = `You are a transaction parser for a Kakeibo budgeting app. Analyze the user's input and determine the intent.

If the input is a transaction (adding an expense or income), return:
{"intent":"transaction","label":"string","amount":number,"pillar":"needs|wants|culture|unexpected","category":"string","date":"YYYY-MM-DD","type":"expense|income"}

If the input is a query (asking about spending, totals, summaries), return:
{"intent":"query","answer":"natural language answer"}

Rules:
- "k" or "rb" means thousands (45k = 45000)
- "jt" means millions
- Default date is today ({{today}})
- "yesterday" or "kemarin" = yesterday's date
- Pillar mapping: food/groceries/bills/transport = needs, entertainment/dining out/shopping/coffee = wants, books/courses/hobbies = culture, medical/repairs/emergency = unexpected
- Default type is "expense" unless input says salary/income/gaji/received/bonus
- Support both English and Bahasa Indonesia input
- Return JSON only, no other text`;

export async function llmParse(text: string): Promise<ParseResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  const today = new Date().toISOString().split("T")[0];
  const prompt = SYSTEM_PROMPT.replace("{{today}}", today);

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text },
      ],
      temperature: 0,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const content = JSON.parse(data.choices[0].message.content);

  if (content.intent === "query") {
    return {
      intent: "query",
      query: { answer: content.answer },
    };
  }

  return {
    intent: "transaction",
    transaction: {
      label: content.label,
      amount: content.amount,
      pillar: content.pillar,
      category: content.category || "",
      date: content.date,
      type: content.type || "expense",
      confidence: 0.9,
    },
  };
}
