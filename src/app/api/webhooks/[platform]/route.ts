import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// Supported platforms
type Platform = 'n8n' | 'make' | 'zapier' | 'custom'

/**
 * Verify webhook signature for security
 */
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Handle incoming webhook
 */
async function handleWebhook(
  platform: Platform,
  configId: string,
  payload: any,
  headers: Headers
) {
  const startTime = Date.now()
  const supabase = createAdminClient()
  
  try {
    // Get webhook configuration
    const { data: config, error: configError } = await supabase
      .from('webhook_configs')
      .select('*')
      .eq('id', configId)
      .eq('platform', platform)
      .eq('is_active', true)
      .single()

    if (configError || !config) {
      throw new Error('Webhook configuration not found or inactive')
    }

    // Verify signature if secret is provided
    const signature = headers.get('x-webhook-signature') || 
                     headers.get('x-hub-signature-256') ||
                     headers.get('x-signature')
    
    if (config.secret_key && !verifyWebhookSignature(
      JSON.stringify(payload),
      signature,
      config.secret_key
    )) {
      throw new Error('Invalid webhook signature')
    }

    // Process based on platform
    let processedData = null
    switch (platform) {
      case 'n8n':
        processedData = await processN8nWebhook(payload, config)
        break
      case 'make':
        processedData = await processMakeWebhook(payload, config)
        break
      case 'zapier':
        processedData = await processZapierWebhook(payload, config)
        break
      default:
        processedData = payload
    }

    // Update webhook stats
    await supabase
      .from('webhook_configs')
      .update({
        last_triggered_at: new Date().toISOString(),
        trigger_count: config.trigger_count + 1
      })
      .eq('id', configId)

    // Log successful webhook
    await supabase
      .from('webhook_logs')
      .insert({
        webhook_config_id: configId,
        event_type: payload.event || 'webhook_received',
        payload: processedData,
        response_status: 200,
        execution_time_ms: Date.now() - startTime
      })

    // Track analytics
    await supabase
      .from('usage_analytics')
      .insert({
        organization_id: config.organization_id,
        event_type: 'webhook_received',
        event_category: platform,
        event_data: {
          config_id: configId,
          payload_size: JSON.stringify(payload).length
        }
      })

    return processedData
  } catch (error) {
    // Log error
    await supabase
      .from('webhook_logs')
      .insert({
        webhook_config_id: configId,
        event_type: 'webhook_error',
        payload,
        response_status: 500,
        error_message: error instanceof Error ? error.message : 'Unknown error',
        execution_time_ms: Date.now() - startTime
      })

    // Update error count
    const { data: config } = await supabase
      .from('webhook_configs')
      .select('error_count')
      .eq('id', configId)
      .single()

    if (config) {
      await supabase
        .from('webhook_configs')
        .update({
          error_count: config.error_count + 1
        })
        .eq('id', configId)
    }

    throw error
  }
}

/**
 * Process n8n webhook
 */
async function processN8nWebhook(payload: any, config: any) {
  // n8n specific processing
  const processed = {
    ...payload,
    platform: 'n8n',
    processed_at: new Date().toISOString()
  }

  // If it's a workflow execution result
  if (payload.workflowId && payload.executionId) {
    processed.execution_url = `${config.metadata?.n8n_instance_url || 'https://app.n8n.io'}/workflow/${payload.workflowId}/executions/${payload.executionId}`
  }

  return processed
}

/**
 * Process Make.com webhook
 */
async function processMakeWebhook(payload: any, config: any) {
  // Make.com specific processing
  const processed = {
    ...payload,
    platform: 'make',
    processed_at: new Date().toISOString()
  }

  // Handle Make.com specific fields
  if (payload.scenario_id) {
    processed.scenario_url = `https://eu1.make.com/scenarios/${payload.scenario_id}`
  }

  return processed
}

/**
 * Process Zapier webhook
 */
async function processZapierWebhook(payload: any, config: any) {
  // Zapier specific processing
  return {
    ...payload,
    platform: 'zapier',
    processed_at: new Date().toISOString()
  }
}

/**
 * POST /api/webhooks/[platform]
 * Receive webhooks from automation platforms
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const platform = params.platform as Platform
    const configId = request.nextUrl.searchParams.get('config_id')
    
    if (!configId) {
      return NextResponse.json(
        { error: 'Missing config_id parameter' },
        { status: 400 }
      )
    }

    if (!['n8n', 'make', 'zapier', 'custom'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      )
    }

    const payload = await request.json()
    const result = await handleWebhook(
      platform,
      configId,
      payload,
      request.headers
    )

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Webhook processing failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/webhooks/[platform]
 * Get webhook configuration and instructions
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const platform = params.platform as Platform
    const configId = request.nextUrl.searchParams.get('config_id')
    
    if (!configId) {
      return NextResponse.json(
        { error: 'Missing config_id parameter' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    
    const { data: config, error } = await supabase
      .from('webhook_configs')
      .select('*')
      .eq('id', configId)
      .eq('platform', platform)
      .single()

    if (error || !config) {
      return NextResponse.json(
        { error: 'Webhook configuration not found' },
        { status: 404 }
      )
    }

    // Generate webhook URL
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/${platform}?config_id=${configId}`

    // Platform-specific instructions
    let instructions = {}
    switch (platform) {
      case 'n8n':
        instructions = {
          setup: 'Add a Webhook node to your n8n workflow',
          url: webhookUrl,
          method: 'POST',
          authentication: config.secret_key ? 'Add x-webhook-signature header with HMAC-SHA256 signature' : 'None',
          test_command: `curl -X POST ${webhookUrl} -H "Content-Type: application/json" -d '{"test": true}'`
        }
        break
      case 'make':
        instructions = {
          setup: 'Add a Webhook module to your Make.com scenario',
          url: webhookUrl,
          method: 'POST',
          authentication: config.secret_key ? 'Add x-webhook-signature header' : 'None'
        }
        break
      case 'zapier':
        instructions = {
          setup: 'Add a Webhook action to your Zap',
          url: webhookUrl,
          method: 'POST',
          authentication: config.secret_key ? 'Add custom header x-webhook-signature' : 'None'
        }
        break
      default:
        instructions = {
          url: webhookUrl,
          method: 'POST',
          headers: config.headers || {},
          authentication: config.secret_key ? 'HMAC-SHA256 signature required' : 'None'
        }
    }

    return NextResponse.json({
      config: {
        id: config.id,
        name: config.name,
        description: config.description,
        platform: config.platform,
        is_active: config.is_active,
        events: config.events,
        last_triggered_at: config.last_triggered_at,
        trigger_count: config.trigger_count,
        error_count: config.error_count
      },
      webhook_url: webhookUrl,
      instructions
    })
  } catch (error) {
    console.error('Error fetching webhook config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch webhook configuration' },
      { status: 500 }
    )
  }
}