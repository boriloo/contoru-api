import { Context } from 'hono'
import { 
    createDesktopService, 
    deleteDesktopService, 
    getDesktopByIdService, 
    getDesktopByOwnerService, 
    updateDesktopService 
} from "../services/desktopService";
import { CreateDesktopData } from "../types/desktop";

export const createDesktopController = async (c: Context) => {
    try {
        const ownerId = c.get('userId') as string;
        
        // No Hono, usamos parseBody para multipart/form-data (arquivos)
        const body = await c.req.parseBody();
        const { name } = body;
        const file = body['backgroundImage'] as File | undefined;

        if (!name || !ownerId || !file) {
            return c.json({ error: "Missing fields." }, 400);
        }

        // Converte File para Buffer para manter compatibilidade com seu service atual
        const arrayBuffer = await file.arrayBuffer();
        const backgroundImage = Buffer.from(arrayBuffer);

        const desktop = await createDesktopService({ 
            name: name as string, 
            ownerId, 
            backgroundImage 
        } as CreateDesktopData, c.env);

        return c.json(desktop, 201);
    } catch (err: any) {
        console.error(err);
        return c.json({ error: "Server Error" }, 500);
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
        
        const body = await c.req.parseBody();
        const { name } = body;
        const file = body['backgroundImage'] as File | undefined;

        let backgroundImage: Buffer | undefined;
        if (file instanceof File) {
            const arrayBuffer = await file.arrayBuffer();
            backgroundImage = Buffer.from(arrayBuffer);
        }

        const desktop = await updateDesktopService(desktopId as string, { 
            name: name as string, 
            backgroundImage 
        }, c.env);

        return c.json(desktop, 201);
    } catch (err: any) {
        if (err.message === "No fields provided for update." || err.message === "Desktop not found.") {
            return c.json({ error: err.message }, 404);
        }
        console.error(err);
        return c.json({ error: 'Server Error' }, 500);
    }
}

export const deleteDesktopController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId');

        await deleteDesktopService(desktopId, c.env);

        return c.body(null, 204);
    } catch (err: any) {
        if (err.message === "Desktop doesn't exist.") {
            return c.json({ error: err.message }, 404);
        }
        console.error(err);
        return c.json({ error: 'Server Error' }, 500);
    }
}