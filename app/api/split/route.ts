import { NextResponse } from "next/server";

const MODEL_LIMITS: Record<string, number> = {
  "gpt-4.1-mini": 128000,
  "gpt-4.1": 128000,
  "gpt-4o-mini": 128000,
  "gpt-4o": 128000,
};

const DEFAULT_LIMIT = 32000;

const approximateTokens = (text: string) =>
  Math.max(1, Math.ceil(text.length / 4));

const splitByParagraphs = (text: string) =>
  text
    .split(/\n{2,}/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

const splitBySentences = (text: string) =>
  text
    .split(/(?<=[.!?])\s+/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

const splitIntoChunks = (text: string, tokenLimit: number) => {
  const chunks: string[] = [];
  let buffer = "";
  let bufferTokens = 0;

  const pushBuffer = () => {
    if (!buffer.trim()) {
      return;
    }
    chunks.push(buffer.trim());
    buffer = "";
    bufferTokens = 0;
  };

  const appendPart = (part: string) => {
    const partTokens = approximateTokens(part);
    if (partTokens > tokenLimit) {
      splitBySentences(part).forEach((sentence) => appendPart(sentence));
      return;
    }
    if (bufferTokens + partTokens > tokenLimit) {
      pushBuffer();
    }
    buffer = buffer ? `${buffer}\n\n${part}` : part;
    bufferTokens += partTokens;
  };

  splitByParagraphs(text).forEach((part) => appendPart(part));
  pushBuffer();
  return chunks;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    text?: string;
    model?: string;
    maxTokens?: number;
  };

  const text = payload.text?.trim() ?? "";
  if (!text) {
    return NextResponse.json(
      { error: "Missing text input." },
      { status: 400 },
    );
  }

  const modelLimit = MODEL_LIMITS[payload.model ?? ""] ?? DEFAULT_LIMIT;
  const maxTokens = payload.maxTokens && payload.maxTokens > 0
    ? Math.min(payload.maxTokens, modelLimit)
    : modelLimit;

  const chunks = splitIntoChunks(text, maxTokens).map((chunk, index) => ({
    id: index + 1,
    filename: `chat-part-${String(index + 1).padStart(2, "0")}.txt`,
    text: chunk,
    approxTokens: approximateTokens(chunk),
  }));

  return NextResponse.json({ chunks });
}
