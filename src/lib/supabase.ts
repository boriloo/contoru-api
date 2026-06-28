import { createClient } from '@supabase/supabase-js'

export const getSupabase = (env: any) =>
    createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
                storage: undefined
            }
        }
    )

export const getSupabaseAdmin = (env: any) =>
    createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
                storage: undefined
            }
        }
    )