// controllers/dtInviteController.ts
import { Context } from 'hono'
import {
    createDtInviteService,
    getPendingDtInvitesService,
    acceptDtInviteService,
    deleteDtInviteService,
    getPendingDtInvitesFromDesktopService
} from '../services/dtInviteService'

export const createDtInviteController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId')
        const receiverId = c.req.param('receiverId')

        if (!desktopId || !receiverId) {
            return c.json({ error: "Missing fields." }, 400)
        }

        const invite = await createDtInviteService(desktopId, receiverId, c.env)
        return c.json(invite, 201)

    } catch (err: any) {
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const getPendingDtInvitesController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string
        const invites = await getPendingDtInvitesService(userId, c.env)
        return c.json(invites, 200)

    } catch (err: any) {
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const getPendingDtInvitesFromDesktopController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId') as string
        const invites = await getPendingDtInvitesFromDesktopService(desktopId, c.env)
        return c.json(invites, 200)

    } catch (err: any) {
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const acceptDtInviteController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string
        const inviteId = c.req.param('inviteId')

        if (!inviteId) return c.json({ error: "Missing invite id." }, 400)

        const result = await acceptDtInviteService(inviteId, userId, c.env)
        return c.json(result, 200)

    } catch (err: any) {
        if (err.message === "Invite not found.") {
            return c.json({ error: err.message }, 404)
        }
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const deleteDtInviteController = async (c: Context) => {
    try {
        const inviteId = c.req.param('inviteId')

        if (!inviteId) return c.json({ error: "Missing invite id." }, 400)

        await deleteDtInviteService(inviteId, c.env)
        return c.body(null, 204)

    } catch (err: any) {
        if (err.message === "Failed to delete invite.") {
            return c.json({ error: err.message }, 404)
        }
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}