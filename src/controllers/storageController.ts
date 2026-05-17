import { Context } from "hono"

export const getStorageController = async (c: Context) => {
    const key = c.req.param('key')
    const object = await c.env.STORAGE.get(key)

    if (!object) return c.json({ error: 'Not found' }, 404)

    return new Response(object.body as any, {
        headers: {
            'Content-Type': object.httpMetadata?.contentType || 'image/png',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=31536000',
        }
    })
}