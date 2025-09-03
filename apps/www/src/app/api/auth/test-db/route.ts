import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user } from '@/lib/schema';
import { count } from 'drizzle-orm';

/**
 * Test endpoint to verify database connection and Better Auth tables
 * GET /api/auth/test-db
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ 
      error: 'This endpoint is only available in development' 
    }, { status: 403 });
  }

  try {
    console.log('Testing database connection...');
    
    // Test basic database connection
    const userCount = await db.select({ count: count() }).from(user);
    
    console.log('Database connection successful. User count:', userCount[0]?.count || 0);
    
    // Test if we can query the auth tables
    const tables = ['user', 'session', 'account', 'verification'];
    const tableStatus: Record<string, { exists: boolean; count?: number; error?: string }> = {};
    
    for (const tableName of tables) {
      try {
        // This is a basic existence check - we try to count rows
        const result = await db.execute(`SELECT COUNT(*) as count FROM "${tableName}"`);
        
        tableStatus[tableName] = {
          exists: true,
          count: (result as unknown as { count: number }[])?.[0]?.count || 0
        };
      } catch (error) {
        tableStatus[tableName] = {
          exists: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: userCount[0]?.count || 0,
      tables: tableStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}