import { Context } from "hono"
import { deleteFromStorageService, uploadToStorageService } from "../services/storageService"

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

export const getFileProxyController = async (c: Context) => {
    try {
        const key = c.req.param('key');

        const object = await c.env.STORAGE.get(key);

        if (!object) {
            return c.json({ error: 'Arquivo não encontrado' }, 404);
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);


        return new Response(object.body, {
            status: 200,
            headers: headers
        });

    } catch (err) {
        console.error(err);
        return c.json({ error: 'Erro interno no servidor' }, 500);
    }
}

export const uploadStorageController = async (c: Context) => {
    try {

        const body = await c.req.parseBody();

        const file = body['file'] as File | undefined;
        const type = body['type'] as string | undefined;
        const desktopId = body['desktopId'] as string | undefined;

        if (!file) return c.json({ error: 'No file provided' }, 400)

        console.log('Nome do arquivo:', file.name);
        console.log('Tamanho (bytes):', file.size);
        console.log('Tipo (MIME):', file.type);
        console.log('Dados adicionais:', { type, desktopId });

        if (file.size > 5 * 1024 * 1024) {
            return c.json({ error: 'File too large' }, 400)
        }

        if (!file.type.startsWith('image/')) {
            return c.json({ error: 'Only images are allowed.' }, 400)
        }

        const userId = c.get('userId') as string
        const ext = file.name.split('.').pop()

        let key;

        if (type === 'desktop' && desktopId) {
            key = `desktops/${desktopId}`
        } else if (type === 'file' && desktopId) {
            key = `files/${desktopId}/${Date.now()}`
        } else {
            key = `users/${userId}`
        }

        const path = await uploadToStorageService(file, key, c.env)

        return c.json({ path }, 201)

    } catch (err: any) {
        console.error(err)
        return c.json({ error: 'Upload failed.' }, 500)
    }
}

export const deleteStorageController = async (c: Context) => {
    try {
        const key = c.req.param('key')

        if (!key) return c.json({ error: 'No key provided' }, 400)

        const exists = await c.env.STORAGE.get(key)
        if (!exists) return c.json({ error: 'File not found' }, 404)

        await deleteFromStorageService(key, c.env)

        return c.body(null, 204)
    } catch (err) {
        console.error(err)
        return c.json({ error: 'Delete failed.' }, 500)
    }
}