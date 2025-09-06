import { NextRequest } from 'next/server';
import { db, postgresClient } from '@/lib/db';
import { user } from '@/lib/schema';
import { count } from 'drizzle-orm';
import { 
  validateRequest, 
  createSecureResponse, 
  createErrorResponse,
  requireDevelopment
} from '@/lib/security';

/**
 * Test endpoint to verify database connection and Better Auth tables
 * GET /api/auth/test-db
 * 
 * SECURITY: Only available in development environment
 */
export async function GET(request: NextRequest) {
  // Check if development environment
  const devCheck = requireDevelopment();
  if (!devCheck.success) {
    return createErrorResponse(devCheck.error || 'Not found', 404);
  }

  // Apply security validation with strict rate limiting for debug endpoints
  const validation = await validateRequest(request, {
    rateLimitType: 'debug', // 3 requests per minute
    allowedMethods: ['GET'],
  });

  if (!validation.success) {
    return validation.response!;
  }

  try {
    console.log('[Debug] Testing database connection...');
    
    // Test basic database connection
    const userCount = await db.select({ count: count() }).from(user);
    
    console.log('[Debug] Database connection successful. User count:', userCount[0]?.count || 0);
    
    // Test if we can query the auth tables
    const tables = ['user', 'session', 'account', 'verification'];
    const tableStatus: Record<string, { exists: boolean; count?: number; error?: string }> = {};
    
    for (const tableName of tables) {
      try {
        // This is a basic existence check - we try to count rows using raw postgres client
        const result = await postgresClient`SELECT COUNT(*) as count FROM ${postgresClient(tableName)}`;
        
        tableStatus[tableName] = {
          exists: true,
          count: Number(result?.[0]?.count) || 0
        };
      } catch (error) {
        tableStatus[tableName] = {
          exists: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }

    return createSecureResponse({
      success: true,
      message: 'Database connection successful',
      userCount: userCount[0]?.count || 0,
      tables: tableStatus,
      timestamp: new Date().toISOString(),
      environment: 'development'
    });

  } catch (error) {
    console.error('[Debug] Database connection test failed:', error);
    
    return createErrorResponse(
      'Database connection test failed',
      500,
      error
    );
  }
}