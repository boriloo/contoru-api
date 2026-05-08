import { createMiddleware } from 'hono/factory'
import { getSupabase } from '../lib/supabase' 

export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
        return c.json({ error: "No token provided" }, 401)
    }

    try {
        const supabase = getSupabase(c.env)
        
       
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            return c.json({ error: "Invalid or expired token" }, 401)
        }

       
        c.set('userId' as any, user.id)

        await next()
    } catch (err) {
        return c.json({ error: "Auth service unavailable" }, 401)
    }
})