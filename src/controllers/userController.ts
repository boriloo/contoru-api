import { Context } from 'hono'
import { deleteUserService, getMeService, getUserEmailService, updateUserService } from '../services/userService'

export const getMeController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string

        const user = await getMeService(userId, c.env)

        return c.json(user, 200)
    } catch (err: any) {
        if (err.message === "User doesn't exist.") {
            return c.json({ error: err.message }, 400)
        }
        return c.json({ error: "Server Error" }, 500)
    }
}

export const getUserEmailController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string

        const email = await getUserEmailService(userId, c.env)

        return c.json(email, 200)
    } catch (err: any) {
        if (err.message === "User doesn't exist.") {
            return c.json({ error: err.message }, 400)
        }
        return c.json({ error: "Server Error" }, 500)
    }
}

export const updateUserController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string

        // Para lidar com multipart/form-data (arquivos e campos), usamos parseBody
        const body = await c.req.parseBody()
        const { name } = body

        // No Cloudflare Workers/Hono, arquivos vêm como instâncias de File ou Blob
        const file = body['profileImage'] as File | undefined
        let profileImage: Buffer | undefined

        if (file) {
            const arrayBuffer = await file.arrayBuffer()
            profileImage = Buffer.from(arrayBuffer)
        }

        const user = await updateUserService(userId, {
            name: name as string,
            profileImage
        }, c.env) // Passando c.env caso seu service precise das chaves do Supabase

        return c.json(user, 201)
    } catch (err: any) {
        if (err.message === "No fields provided for update." || err.message === "User not found.") {
            return c.json({ error: err.message }, 404)
        }
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}



export const deleteUserController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string

        await deleteUserService(userId, c.env)

        // No Hono, para 204 No Content, retornamos um body vazio ou null
        return c.body(null, 204)
    } catch (err: any) {
        if (err.message === "User doesn't exist.") {
            return c.json({ error: err.message }, 404)
        }
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}