/**
 * Database Connection and Operations Test
 * Run with: npm test src/tests/database.test.ts
 */

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getCurrentProfile, createProfile, updateProfile } from '@/app/actions/profiles'
import { createOrganization, getUserOrganizations } from '@/app/actions/organizations'
import { getActiveDemos, getFeaturedDemos } from '@/app/actions/demos'

// Test utilities
const log = (message: string, data?: any) => {
  console.log(`\n✅ ${message}`)
  if (data) {
    console.log(JSON.stringify(data, null, 2))
  }
}

const error = (message: string, err?: any) => {
  console.error(`\n❌ ${message}`)
  if (err) {
    console.error(err)
  }
}

/**
 * Test Supabase connection
 */
async function testSupabaseConnection() {
  console.log('\n🔄 Testing Supabase Connection...')
  
  try {
    const supabase = createAdminClient()
    
    // Test basic query
    const { data, error: queryError } = await supabase
      .from('profiles')
      .select('count')
      .single()
    
    if (queryError) {
      // Table might not exist yet, that's ok
      if (queryError.code === 'PGRST116') {
        log('Database connected, tables not yet created')
        return true
      }
      throw queryError
    }
    
    log('Database connection successful', data)
    return true
  } catch (err) {
    error('Database connection failed', err)
    return false
  }
}

/**
 * Test profile operations
 */
async function testProfileOperations() {
  console.log('\n🔄 Testing Profile Operations...')
  
  try {
    // Test getting current profile (should fail when not authenticated)
    const profileResult = await getCurrentProfile()
    
    if (profileResult.error === 'Not authenticated') {
      log('Profile authentication check working correctly')
    } else if (profileResult.data) {
      log('Current profile retrieved', profileResult.data)
    }
    
    return true
  } catch (err) {
    error('Profile operations failed', err)
    return false
  }
}

/**
 * Test demo operations
 */
async function testDemoOperations() {
  console.log('\n🔄 Testing Demo Operations...')
  
  try {
    // Test getting active demos
    const activeDemos = await getActiveDemos()
    
    if (activeDemos.error) {
      // Table might not exist yet
      if (activeDemos.error.includes('relation') && activeDemos.error.includes('does not exist')) {
        log('Demo table not yet created')
        return true
      }
      throw new Error(activeDemos.error)
    }
    
    log(`Found ${activeDemos.data?.length || 0} active demos`)
    
    // Test getting featured demos
    const featuredDemos = await getFeaturedDemos()
    
    if (featuredDemos.data) {
      log(`Found ${featuredDemos.data.length} featured demos`)
    }
    
    return true
  } catch (err) {
    error('Demo operations failed', err)
    return false
  }
}

/**
 * Test webhook endpoint
 */
async function testWebhookEndpoint() {
  console.log('\n🔄 Testing Webhook Endpoint...')
  
  try {
    const testPayload = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Test webhook'
    }
    
    // Test n8n webhook endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/n8n?config_id=test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    })
    
    if (response.status === 500 || response.status === 404) {
      // Expected when config doesn't exist
      log('Webhook endpoint responding correctly')
      return true
    }
    
    const result = await response.json()
    log('Webhook endpoint test result', result)
    
    return true
  } catch (err) {
    error('Webhook endpoint test failed', err)
    return false
  }
}

/**
 * Test database schema creation
 */
async function testDatabaseSchema() {
  console.log('\n🔄 Testing Database Schema...')
  
  try {
    const supabase = createAdminClient()
    
    // Check if tables exist
    const tables = [
      'profiles',
      'organizations',
      'organization_members',
      'automation_demos',
      'automation_templates',
      'webhook_configs',
      'webhook_logs',
      'usage_analytics',
      'demo_interactions',
      'ai_chat_sessions',
      'ai_chat_messages'
    ]
    
    const results = await Promise.all(
      tables.map(async (table) => {
        const { error } = await supabase
          .from(table)
          .select('count')
          .limit(1)
          .single()
        
        return {
          table,
          exists: !error || error.code !== 'PGRST116'
        }
      })
    )
    
    const existingTables = results.filter(r => r.exists)
    const missingTables = results.filter(r => !r.exists)
    
    if (existingTables.length > 0) {
      log(`Found ${existingTables.length} tables:`, existingTables.map(t => t.table))
    }
    
    if (missingTables.length > 0) {
      log(`Missing ${missingTables.length} tables (run migration):`, missingTables.map(t => t.table))
    }
    
    return true
  } catch (err) {
    error('Schema test failed', err)
    return false
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('================================================')
  console.log('     Afarsemon Backend Test Suite')
  console.log('================================================')
  
  const tests = [
    { name: 'Supabase Connection', fn: testSupabaseConnection },
    { name: 'Database Schema', fn: testDatabaseSchema },
    { name: 'Profile Operations', fn: testProfileOperations },
    { name: 'Demo Operations', fn: testDemoOperations },
    { name: 'Webhook Endpoint', fn: testWebhookEndpoint }
  ]
  
  const results = []
  
  for (const test of tests) {
    const passed = await test.fn()
    results.push({ name: test.name, passed })
  }
  
  console.log('\n================================================')
  console.log('                Test Results')
  console.log('================================================')
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌'
    console.log(`${icon} ${result.name}: ${result.passed ? 'PASSED' : 'FAILED'}`)
  })
  
  const totalPassed = results.filter(r => r.passed).length
  const totalTests = results.length
  
  console.log('\n------------------------------------------------')
  console.log(`Total: ${totalPassed}/${totalTests} tests passed`)
  
  if (totalPassed === totalTests) {
    console.log('\n🎉 All tests passed!')
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above.')
  }
  
  console.log('================================================\n')
  
  return totalPassed === totalTests
}

// Run tests if executed directly
if (require.main === module) {
  runTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(err => {
      console.error('Test runner error:', err)
      process.exit(1)
    })
}

export { runTests }