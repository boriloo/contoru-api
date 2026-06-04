import { createMiddleware } from 'hono/factory'
import { getSupabase } from '../lib/supabase'
import { createClient } from '@supabase/supabase-js'

export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) return c.json({ error: "No token provided" }, 401, {
        'Cache-Control': 'no-store'
    })

    try {

        const supabase = createClient(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_ANON_KEY,
            {
                global: {
                    headers: { Authorization: `Bearer ${token}` }
                },
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                }
            }
        )

        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) return c.json({ error: "Invalid or expired token" }, 401)

        c.set('userId' as any, user.id)
        await next()
    } catch (err) {
        return c.json({ error: "Auth service unavailable" }, 401)
    }
})