'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type DemoInsert = Database['public']['Tables']['automation_demos']['Insert']
type InteractionInsert = Database['public']['Tables']['demo_interactions']['Insert']

/**
 * Get all active demos
 */
export async function getActiveDemos(category?: string) {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('automation_demos')
      .select('*')
      .eq('is_active', true)
      .order('wow_factor', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching demos:', error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('Unexpected error in getActiveDemos:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Get featured demos
 */
export async function getFeaturedDemos() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('automation_demos')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('wow_factor', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Error fetching featured demos:', error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('Unexpected error in getFeaturedDemos:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Get demo by ID
 */
export async function getDemoById(id: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('automation_demos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching demo:', error)
      return { error: error.message }
    }

    // Increment view count
    await trackDemoInteraction(id, 'view')

    return { data }
  } catch (error) {
    console.error('Unexpected error in getDemoById:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Track demo interaction
 */
export async function trackDemoInteraction(
  demoId: string,
  interactionType: 'view' | 'play' | 'complete' | 'share' | 'save',
  additionalData?: any
) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get organization if user is logged in
    let organizationId = null
    if (user) {
      const { data: memberData } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()
      
      if (memberData) {
        organizationId = memberData.organization_id
      }
    }

    // Record interaction
    const interaction: InteractionInsert = {
      demo_id: demoId,
      user_id: user?.id || null,
      organization_id: organizationId,
      interaction_type: interactionType,
      interaction_data: additionalData,
      session_id: generateSessionId()
    }

    const { error: interactionError } = await supabase
      .from('demo_interactions')
      .insert(interaction)

    if (interactionError) {
      console.error('Error tracking interaction:', interactionError)
    }

    // Update demo counters
    if (interactionType === 'view') {
      await supabase.rpc('increment_view_count', { demo_id: demoId })
    } else {
      await supabase.rpc('increment_interaction_count', { demo_id: demoId })
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in trackDemoInteraction:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Rate a demo
 */
export async function rateDemo(demoId: string, rating: number, feedback?: string) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('demo_interactions')
      .insert({
        demo_id: demoId,
        user_id: user?.id || null,
        interaction_type: 'complete',
        rating,
        feedback,
        session_id: generateSessionId()
      })

    if (error) {
      console.error('Error rating demo:', error)
      return { error: error.message }
    }

    // Update average rating
    await updateDemoRating(demoId)

    revalidatePath('/demos')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error in rateDemo:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Create a new demo (admin only)
 */
export async function createDemo(demo: DemoInsert) {
  try {
    const supabase = await createClient()
    
    // Verify user is admin
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('automation_demos')
      .insert(demo)
      .select()
      .single()

    if (error) {
      console.error('Error creating demo:', error)
      return { error: error.message }
    }

    revalidatePath('/demos')
    revalidatePath('/admin/demos')
    return { data }
  } catch (error) {
    console.error('Unexpected error in createDemo:', error)
    return { error: 'An unexpected error occurred' }
  }
}

// Helper functions
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

async function updateDemoRating(demoId: string) {
  const supabase = createAdminClient()
  
  const { data: ratings } = await supabase
    .from('demo_interactions')
    .select('rating')
    .eq('demo_id', demoId)
    .not('rating', 'is', null)

  if (ratings && ratings.length > 0) {
    const average = ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
    
    await supabase
      .from('automation_demos')
      .update({ average_rating: average })
      .eq('id', demoId)
  }
}