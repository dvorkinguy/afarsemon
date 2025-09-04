import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest, NextResponse } from "next/server"

// Create the handlers with error handling wrapper
const handlers = toNextJsHandler(auth.handler)

// Enhanced GET handler with error logging
export async function GET(request: NextRequest) {
  try {
    // Log the request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth GET] Request URL:', request.url)
      console.log('[Auth GET] Request headers:', Object.fromEntries(request.headers.entries()))
    }
    
    // Call the original handler
    const response = await handlers.GET(request)
    
    // Log response status in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth GET] Response status:', response.status)
    }
    
    return response
  } catch (error) {
    // Enhanced error logging
    console.error('[Auth GET] Error occurred:', error)
    console.error('[Auth GET] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('[Auth GET] Request URL that failed:', request.url)
    console.error('[Auth GET] Request method:', request.method)
    
    // Return a proper error response
    return NextResponse.json(
      { 
        error: 'Authentication request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        path: request.url
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}

// Enhanced POST handler with error logging
export async function POST(request: NextRequest) {
  try {
    // Log the request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth POST] Request URL:', request.url)
      console.log('[Auth POST] Request headers:', Object.fromEntries(request.headers.entries()))
      
      // Try to log the body (be careful with sensitive data)
      try {
        const clonedRequest = request.clone()
        const body = await clonedRequest.text()
        if (body) {
          // Mask sensitive fields
          const parsedBody = JSON.parse(body)
          if (parsedBody.password) parsedBody.password = '[MASKED]'
          if (parsedBody.token) parsedBody.token = '[MASKED]'
          console.log('[Auth POST] Request body:', parsedBody)
        }
      } catch {
        // Body parsing failed, ignore
      }
    }
    
    // Call the original handler
    const response = await handlers.POST(request)
    
    // Log response status in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth POST] Response status:', response.status)
    }
    
    return response
  } catch (error) {
    // Enhanced error logging
    console.error('[Auth POST] Error occurred:', error)
    console.error('[Auth POST] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('[Auth POST] Request URL that failed:', request.url)
    console.error('[Auth POST] Request method:', request.method)
    
    // Return a proper error response
    return NextResponse.json(
      { 
        error: 'Authentication request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        path: request.url
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}