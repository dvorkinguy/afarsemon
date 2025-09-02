import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
  });

  return (
    result as unknown as { toUIMessageStreamResponse: () => Response }
  ).toUIMessageStreamResponse();
}
