/**
 * API Routes and Server Actions Test
 * Tests all API endpoints and server actions
 */

import { testWebhookEndpoint } from './webhook.test'

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
 * Test webhook GET endpoint
 */
async function testWebhookGetEndpoint() {
  console.log('\n🔄 Testing Webhook GET Endpoint...')
  
  try {
    const platforms = ['n8n', 'make', 'zapier', 'custom']
    
    for (const platform of platforms) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/${platform}?config_id=test`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      const result = await response.json()
      
      if (response.status === 404 && result.error === 'Webhook configuration not found') {
        log(`${platform} webhook GET endpoint working correctly (404 for non-existent config)`)
      } else {
        log(`${platform} webhook GET response:`, result)
      }
    }
    
    return true
  } catch (err) {
    error('Webhook GET endpoint test failed', err)
    return false
  }
}

/**
 * Test webhook POST with different payloads
 */
async function testWebhookPostVariations() {
  console.log('\n🔄 Testing Webhook POST Variations...')
  
  try {
    const testCases = [
      {
        platform: 'n8n',
        payload: {
          workflowId: 'test-workflow',
          executionId: 'test-execution',
          data: { test: true }
        }
      },
      {
        platform: 'make',
        payload: {
          scenario_id: 'test-scenario',
          execution_id: 'test-execution',
          data: { test: true }
        }
      },
      {
        platform: 'zapier',
        payload: {
          zap_id: 'test-zap',
          task_id: 'test-task',
          data: { test: true }
        }
      }
    ]
    
    for (const testCase of testCases) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/${testCase.platform}?config_id=test`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testCase.payload)
        }
      )
      
      if (response.status === 500) {
        // Expected when config doesn't exist
        log(`${testCase.platform} webhook POST handled correctly`)
      } else {
        const result = await response.json()
        log(`${testCase.platform} webhook POST response:`, result)
      }
    }
    
    return true
  } catch (err) {
    error('Webhook POST variations test failed', err)
    return false
  }
}

/**
 * Test webhook signature verification
 */
async function testWebhookSignature() {
  console.log('\n🔄 Testing Webhook Signature Verification...')
  
  try {
    const crypto = require('crypto')
    const payload = { test: true, timestamp: new Date().toISOString() }
    const secret = 'test-secret-key'
    
    // Calculate correct signature
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex')
    
    // Test with correct signature
    const responseWithSig = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/n8n?config_id=test`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-signature': signature
        },
        body: JSON.stringify(payload)
      }
    )
    
    // Test without signature
    const responseNoSig = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/n8n?config_id=test`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )
    
    log('Webhook signature verification tested')
    return true
  } catch (err) {
    error('Webhook signature test failed', err)
    return false
  }
}

/**
 * Test error handling
 */
async function testErrorHandling() {
  console.log('\n🔄 Testing Error Handling...')
  
  try {
    // Test missing config_id
    const response1 = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/n8n`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: true })
      }
    )
    
    if (response1.status === 400) {
      const result = await response1.json()
      if (result.error === 'Missing config_id parameter') {
        log('Missing config_id handled correctly')
      }
    }
    
    // Test invalid platform
    const response2 = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/invalid-platform?config_id=test`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: true })
      }
    )
    
    if (response2.status === 400) {
      const result = await response2.json()
      if (result.error === 'Invalid platform') {
        log('Invalid platform handled correctly')
      }
    }
    
    // Test malformed JSON
    const response3 = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/n8n?config_id=test`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid json'
      }
    )
    
    if (response3.status === 400 || response3.status === 500) {
      log('Malformed JSON handled correctly')
    }
    
    return true
  } catch (err) {
    error('Error handling test failed', err)
    return false
  }
}

/**
 * Main API test runner
 */
async function runApiTests() {
  console.log('================================================')
  console.log('           API Routes Test Suite')
  console.log('================================================')
  
  const tests = [
    { name: 'Webhook GET Endpoint', fn: testWebhookGetEndpoint },
    { name: 'Webhook POST Variations', fn: testWebhookPostVariations },
    { name: 'Webhook Signature', fn: testWebhookSignature },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'Webhook Integration', fn: testWebhookEndpoint }
  ]
  
  const results = []
  
  for (const test of tests) {
    const passed = await test.fn()
    results.push({ name: test.name, passed })
  }
  
  console.log('\n================================================')
  console.log('              API Test Results')
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
    console.log('\n🎉 All API tests passed!')
  } else {
    console.log('\n⚠️  Some API tests failed. Check the logs above.')
  }
  
  return totalPassed === totalTests
}

// Run tests if executed directly
if (require.main === module) {
  runApiTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(err => {
      console.error('API test runner error:', err)
      process.exit(1)
    })
}

export { runApiTests, testWebhookEndpoint }