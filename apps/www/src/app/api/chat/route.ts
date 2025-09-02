import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Verify authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  // Validate request body
  let messages: UIMessage[];
  try {
    const body = await req.json();
    messages = body.messages;
    
    if (!Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }
  } catch {
    return NextResponse.json(
      { error: "Bad Request: Invalid request body" },
      { status: 400 }
    );
  }

  try {
    const result = streamText({
      model: google(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
      messages: convertToModelMessages(messages),
    });

    return (
      result as unknown as { toUIMessageStreamResponse: () => Response }
    ).toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
