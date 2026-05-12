import { createBrowserClient } from '@supabase/ssr'
import { createFallbackSupabaseClient } from './fallback'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return createFallbackSupabaseClient()
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
