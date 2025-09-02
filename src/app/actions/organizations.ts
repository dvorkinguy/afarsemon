'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
type OrganizationUpdate = Database['public']['Tables']['organizations']['Update']
type MemberInsert = Database['public']['Tables']['organization_members']['Insert']

/**
 * Create a new organization
 */
export async function createOrganization(org: Omit<OrganizationInsert, 'owner_id'>) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    // Start a transaction
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        ...org,
        owner_id: user.id,
        slug: org.slug || org.name.toLowerCase().replace(/\s+/g, '-')
      })
      .select()
      .single()

    if (orgError) {
      console.error('Error creating organization:', orgError)
      return { error: orgError.message }
    }

    // Add owner as member
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: orgData.id,
        user_id: user.id,
        role: 'owner',
        joined_at: new Date().toISOString()
      })

    if (memberError) {
      console.error('Error adding owner as member:', memberError)
      return { error: memberError.message }
    }

    revalidatePath('/dashboard')
    return { data: orgData }
  } catch (error) {
    console.error('Unexpected error in createOrganization:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Get user's organizations
 */
export async function getUserOrganizations() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('organization_members')
      .select(`
        role,
        organizations (
          id,
          name,
          name_he,
          slug,
          logo_url,
          subscription_tier,
          subscription_status
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching organizations:', error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('Unexpected error in getUserOrganizations:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Get organization by slug
 */
export async function getOrganizationBySlug(slug: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        organization_members (
          user_id,
          role,
          profiles (
            full_name,
            email,
            avatar_url
          )
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching organization:', error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('Unexpected error in getOrganizationBySlug:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Update organization
 */
export async function updateOrganization(id: string, updates: OrganizationUpdate) {
  try {
    const supabase = await createClient()
    
    // Verify user is owner or admin
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', id)
      .eq('user_id', user.id)
      .single()

    if (memberError || !memberData || !['owner', 'admin'].includes(memberData.role)) {
      return { error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating organization:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { data }
  } catch (error) {
    console.error('Unexpected error in updateOrganization:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Invite member to organization
 */
export async function inviteMember(organizationId: string, email: string, role: 'admin' | 'member' | 'viewer') {
  try {
    const supabase = await createClient()
    
    // Verify user can invite (owner or admin)
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
      return { error: 'Unauthorized to invite members' }
    }

    // Find user by email
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (profileError || !profileData) {
      return { error: 'User not found' }
    }

    // Add member
    const { data, error } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organizationId,
        user_id: profileData.id,
        role,
        invited_by: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error inviting member:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { data }
  } catch (error) {
    console.error('Unexpected error in inviteMember:', error)
    return { error: 'An unexpected error occurred' }
  }
}