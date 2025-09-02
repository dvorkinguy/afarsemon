import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

/**
 * Creates a Supabase client for browser/client-side operations
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}