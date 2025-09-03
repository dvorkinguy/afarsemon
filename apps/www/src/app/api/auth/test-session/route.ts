import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET() {
  try {
    // Test direct session retrieval using auth.api
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    return NextResponse.json({
      success: true,
      session: session || null,
      message: session ? "Session found" : "No active session",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Session test error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}