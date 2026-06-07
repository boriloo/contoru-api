import { createMiddleware } from 'hono/factory'

const store = new Map<string, { count: number; resetAt: number }>()
let cleanupCounter = 0

type RateLimitOptions = {
    limit: number
    window: number
    keyPrefix?: string
}

const cleanup = () => {
    const now = Date.now()
    store.forEach((value, key) => {
        if (now > value.resetAt) store.delete(key)
    })
}

export const rateLimit = (options: RateLimitOptions) =>
    createMiddleware(async (c, next) => {
        cleanupCounter++
        if (cleanupCounter % 100 === 0) cleanup()

        const ip = c.req.header('cf-connecting-ip')
            || c.req.header('x-forwarded-for')
            || 'unknown'

        const key = `${options.keyPrefix || 'rl'}:${ip}`
        const now = Date.now()
        const entry = store.get(key)

        if (!entry || now > entry.resetAt) {
            store.set(key, {
                count: 1,
                resetAt: now + options.window * 1000
            })
            return next()
        }

        if (entry.count >= options.limit) {
            return c.json({
                error: 'Too many requests. Try again later.'
            }, 429)
        }

        entry.count++
        return next()
    })