import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'

export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
        return c.json({ error: "No token provided" }, 401)
    }

    try {
        const payload = await verify(token, c.env.JWT_SECRET, 'HS256') as { id: string }

        c.set('userId' as any, payload.id)

        console.log('auth tudo certo')
        await next()
    } catch (err) {
        return c.json({ error: "Invalid token" }, 401)
    }
})