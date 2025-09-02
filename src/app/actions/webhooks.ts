'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'
import crypto from 'crypto'

type WebhookConfigInsert = Database['public']['Tables']['webhook_configs']['Insert']
type WebhookConfigUpdate = Database['public']['Tables']['webhook_configs']['Update']

/**
 * Generate a secure webhook secret
 */
function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create a new webhook configuration
 */
export async function createWebhookConfig(
  organizationId: string,
  config: Omit<WebhookConfigInsert, 'organization_id' | 'secret_key'>
) {
  try {
    const supabase = await createClient()
    
    // Verify user has access to organization
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single()

    if (memberError || !memberData || !['owner', 'admin'].includes(memberData.role)) {
      return { error: 'Unauthorized' }
    }

    // Generate secure secret
    const secret = generateWebhookSecret()

    // Create webhook config
    const { data, error } = await supabase
      .from('webhook_configs')
      .insert({
        ...config,
        organization_id: organizationId,
        secret_key: secret,
        endpoint_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/${config.platform}`
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating webhook config:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard/webhooks')
    return { 
      data,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/${config.platform}?config_id=${data.id}`,
      secret
    }
  } catch (error) {
    console.error('Unexpected error in createWebhookConfig:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Get organization's webhook configurations
 */
export async function getOrganizationWebhooks(organizationId: string) {
  try {
    const supabase = await createClient()
    
    // Verify user has access
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single()

    if (memberError || !memberData) {
      return { error: 'Unauthorized' }
    }

    // Get webhooks
    const { data, error } = await supabase
      .from('webhook_configs')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching webhooks:', error)
      return { error: error.message }
    }

    // Add full webhook URLs
    const webhooksWithUrls = data.map(webhook => ({
      ...webhook,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/${webhook.platform}?config_id=${webhook.id}`
    }))

    return { data: webhooksWithUrls }
  } catch (error) {
    console.error('Unexpected error in getOrganizationWebhooks:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Update webhook configuration
 */
export async function updateWebhookConfig(
  id: string,
  updates: WebhookConfigUpdate
) {
  try {
    const supabase = await createClient()
    
    // Get webhook to verify ownership
    const { data: webhook, error: webhookError } = await supabase
      .from('webhook_configs')
      .select('organization_id')
      .eq('id', id)
      .single()

    if (webhookError || !webhook) {
      return { error: 'Webhook not found' }
    }

    // Verify user has access
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', webhook.organization_id)
      .eq('user_id', user.id)
      .single()

    if (memberError || !memberData || !['owner', 'admin'].includes(memberData.role)) {
      return { error: 'Unauthorized' }
    }

    // Update webhook
    const { data, error } = await supabase
      .from('webhook_configs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating webhook:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard/webhooks')
    return { data }
  } catch (error) {
    console.error('Unexpected error in updateWebhookConfig:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Delete webhook configuration
 */
export async function deleteWebhookConfig(id: string) {
  try {
    const supabase = await createClient()
    
    // Get webhook to verify ownership
    const { data: webhook, error: webhookError } = await supabase
      .from('webhook_configs')
      .select('organization_id')
      .eq('id', id)
      .single()

    if (webhookError || !webhook) {
      return { error: 'Webhook not found' }
    }

    // Verify user has access
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', webhook.organization_id)
      .eq('user_id', user.id)
      .single()

    if (memberError || !memberData || !['owner', 'admin'].includes(memberData.role)) {
      return { error: 'Unauthorized' }
    }

    // Delete webhook (logs will be cascade deleted)
    const { error } = await supabase
      .from('webhook_configs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting webhook:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard/webhooks')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error in deleteWebhookConfig:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Get webhook logs
 */
export async function getWebhookLogs(webhookConfigId: string, limit = 50) {
  try {
    const supabase = await createClient()
    
    // Get webhook to verify ownership
    const { data: webhook, error: webhookError } = await supabase
      .from('webhook_configs')
      .select('organization_id')
      .eq('id', webhookConfigId)
      .single()

    if (webhookError || !webhook) {
      return { error: 'Webhook not found' }
    }

    // Verify user has access
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', webhook.organization_id)
      .eq('user_id', user.id)
      .single()

    if (memberError || !memberData) {
      return { error: 'Unauthorized' }
    }

    // Get logs
    const { data, error } = await supabase
      .from('webhook_logs')
      .select('*')
      .eq('webhook_config_id', webhookConfigId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching webhook logs:', error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('Unexpected error in getWebhookLogs:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Test webhook endpoint
 */
export async function testWebhook(webhookConfigId: string) {
  try {
    const supabase = await createClient()
    
    // Get webhook config
    const { data: webhook, error: webhookError } = await supabase
      .from('webhook_configs')
      .select('*')
      .eq('id', webhookConfigId)
      .single()

    if (webhookError || !webhook) {
      return { error: 'Webhook not found' }
    }

    // Verify user has access
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', webhook.organization_id)
      .eq('user_id', user.id)
      .single()

    if (memberError || !memberData) {
      return { error: 'Unauthorized' }
    }

    // Send test webhook
    const testPayload = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'This is a test webhook from Afarsemon'
    }

    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/${webhook.platform}?config_id=${webhookConfigId}`
    
    // Calculate signature
    const signature = crypto
      .createHmac('sha256', webhook.secret_key)
      .update(JSON.stringify(testPayload))
      .digest('hex')

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': signature
      },
      body: JSON.stringify(testPayload)
    })

    if (!response.ok) {
      const error = await response.text()
      return { error: `Test failed: ${error}` }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Unexpected error in testWebhook:', error)
    return { error: 'An unexpected error occurred' }
  }
}