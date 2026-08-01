import { Context } from 'hono'
import {
    createDesktopService,
    deleteDesktopService,
    getDesktopByIdService,
    getDesktopByMembershipService,
    getDesktopByOwnerService,
    getMembersFromDesktopService,
    getSafeDesktopByIdService,
    leaveDesktopService,
    removeMemberFromDesktopService,
    updateDesktopService
} from "../services/desktopService";
import { CreateDesktopData } from "../types/desktop";
import { deleteFromStorageService } from '../services/storageService';

export const createDesktopController = async (c: Context) => {
    try {
        const ownerId = c.get('userId') as string;

        const body = await c.req.json();

        const { name, backgroundImage, desktopType, members } = body;

        if (!name || !ownerId || !backgroundImage || !desktopType || !members) {
            return c.json({ error: "Missing fields." }, 400);
        }

        const desktop = await createDesktopService({
            name: name as string,
            ownerId,
            backgroundImage: backgroundImage as string,
            desktopType: desktopType as string,
            members: members as any
        } as CreateDesktopData, c.env);

        return c.json(desktop, 201);
    } catch (err: any) {
        if (err.message === "Limit of 5 desktops has been reached.") {
            return c.json({ error: err.message }, 403);
        }
        console.error(err);
        return c.json({ error: "Server Error" }, 500);
    }
}

export const getSafeDesktopByIdController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId');

        const desktop = await getSafeDesktopByIdService(desktopId as string, c.env);

        return c.json(desktop, 201);
    } catch (err: any) {
        if (err.message === "Desktop doesn't exist.") {
            return c.json({ error: err.message }, 404);
        }
        console.error(err);
        return c.json({ error: 'Server Error' }, 500);
    }
}

export const getDesktopByIdController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId');

        const desktop = await getDesktopByIdService(desktopId as string, c.env);

        return c.json(desktop, 201);
    } catch (err: any) {
        if (err.message === "Desktop doesn't exist.") {
            return c.json({ error: err.message }, 404);
        }
        console.error(err);
        return c.json({ error: 'Server Error' }, 500);
    }
}

export const getDesktopByMembershipController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string
        const desktops = await getDesktopByMembershipService(userId, c.env)
        return c.json(desktops, 200)
    } catch (err: any) {
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const getDesktopByOwnerController = async (c: Context) => {
    try {
        const ownerId = c.get('userId') as string;

        const desktops = await getDesktopByOwnerService(ownerId, c.env);

        return c.json(desktops, 201);
    } catch (err: any) {
        console.error(err);
        return c.json({ error: 'Server Error' }, 500);
    }
}

export const updateDesktopController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId');

        const body = await c.req.json();

        const { name, backgroundImage, desktopType } = body;


        const desktop = await updateDesktopService(desktopId as string, {
            name: name as string,
            backgroundImage: backgroundImage as string,
            desktopType: desktopType as string
        }, c.env);

        return c.json(desktop, 201);
    } catch (err: any) {
        if (err.message === "Cannot change to personal desktop while there are members.") {
            return c.json({ error: err.message }, 400)
        }
        if (err.message === "No fields provided for update." || err.message === "Desktop not found.") {
            return c.json({ error: err.message }, 404)
        }
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const deleteDesktopController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId');

        await deleteDesktopService(desktopId as string, c.env);
        await deleteFromStorageService(`desktops/${desktopId}`, c.env);

        return c.body(null, 204);
    } catch (err: any) {
        if (err.message === "Desktop doesn't exist.") {
            return c.json({ error: err.message }, 404);
        }
        console.error(err);
        return c.json({ error: 'Server Error' }, 500);
    }
}

export const getMembersFromDesktopController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId')
        const members = await getMembersFromDesktopService(desktopId as string, c.env)
        return c.json(members, 200)
    } catch (err: any) {
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}

// no desktopController.ts

export const removeMemberFromDesktopController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId')
        const userId = c.req.param('userId')

        await removeMemberFromDesktopService(desktopId as string, userId as string, c.env)
        return c.body(null, 204)
    } catch (err: any) {
        if (err.message === "Failed to remove member.") {
            return c.json({ error: err.message }, 404)
        }
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const leaveDesktopController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId')
        const userId = c.get('userId') as string

        await leaveDesktopService(desktopId as string, userId, c.env)
        return c.body(null, 204)
    } catch (err: any) {
        if (err.message === "Owner cannot leave the desktop.") {
            return c.json({ error: err.message }, 403)
        }
        if (err.message === "Desktop not found.") {
            return c.json({ error: err.message }, 404)
        }
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}