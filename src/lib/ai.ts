import { getAllLibraries } from "@/lib/data/libraries";

const MODEL_URL = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function askAssistant(messages: ChatMessage[]): Promise<string> {
  const libraries = await getAllLibraries();

  const context = libraries.map((l) => ({
    name: l.name,
    area: [l.locality, l.district].filter(Boolean).join(", "),
    price: l.details?.pricing ?? "not listed",
    rating: l.rating ?? "not listed",
    amenities: l.details?.amenities ?? [],
  }));

  const systemInstruction = `You are the ShelfSpace assistant, helping students find study libraries.
STRICT RULES:
- Only use the library data provided below. Never invent a library, price, amenity, or rating.
- If the answer isn't in this data, say you don't have that information — do not guess.
- Keep answers under 60 words, plain and friendly, no markdown.

Library data:
${JSON.stringify(context)}`;

  const recent = messages.slice(-6);

  const res = await fetch(MODEL_URL(process.env.GEMINI_API_KEY!), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: recent.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    }),
  });

  if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No text returned");
  return text.trim();
}