'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

/**
 * Get current user's profile
 */
export async function getCurrentProfile() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('Unexpected error in getCurrentProfile:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Create a new user profile
 */
export async function createProfile(profile: ProfileInsert) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return { error: error.message }
    }

    revalidatePath('/profile')
    return { data }
  } catch (error) {
    console.error('Unexpected error in createProfile:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Update user profile
 */
export async function updateProfile(id: string, updates: ProfileUpdate) {
  try {
    const supabase = await createClient()
    
    // Verify user owns this profile
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user || user.id !== id) {
      return { error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return { error: error.message }
    }

    revalidatePath('/profile')
    return { data }
  } catch (error) {
    console.error('Unexpected error in updateProfile:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Complete user onboarding
 */
export async function completeOnboarding(profileData: ProfileUpdate) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const updates = {
      ...profileData,
      onboarding_completed: true
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error completing onboarding:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/profile')
    return { data }
  } catch (error) {
    console.error('Unexpected error in completeOnboarding:', error)
    return { error: 'An unexpected error occurred' }
  }
}