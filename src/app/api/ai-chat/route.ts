import { NextResponse } from "next/server";
import { askAssistant, type ChatMessage } from "@/lib/ai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages.slice(-6) : [];
  if (messages.length === 0) return NextResponse.json({ error: "Missing messages" }, { status: 400 });

  try {
    const reply = await askAssistant(messages);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "AI request failed" }, { status: 502 });
  }
}
