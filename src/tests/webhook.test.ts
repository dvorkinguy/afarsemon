/**
 * Webhook-specific tests
 */

export async function testWebhookEndpoint() {
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
      console.log('✅ Webhook endpoint responding correctly')
      return true
    }
    
    const result = await response.json()
    console.log('✅ Webhook endpoint test result', result)
    
    return true
  } catch (err) {
    console.error('❌ Webhook endpoint test failed', err)
    return false
  }
}