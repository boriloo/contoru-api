import { Context } from 'hono'
import {
    createFileService,
    deleteFileService,
    getAllFilesFromDesktopService,
    getFileByIdService,
    getFilesFromDesktopService,
    getFilesFromParentService,
    getFilesParentNamesService,
    updateFilePositionService
} from '../services/fileService'
import { CreateFileBodyData, CreateFileData } from '../types/file'

export const createFileController = async (c: Context) => {
    try {
        const ownerId = c.get('userId') as string
        const desktopId = c.req.param('desktopId')

        const data: CreateFileBodyData = await c.req.json()

        if (!data || !ownerId || !desktopId) {
            return c.json({ error: "Missing fields." }, 400)
        }

        const fullData: CreateFileData = {
            ...data,
            ownerId,
            desktopId
        }

        const file = await createFileService(fullData, c.env)
        return c.json(file, 201)

    } catch (err: any) {
        return c.json({ error: err.message }, 500)
    }
}

export const getAllFilesFromDesktopController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId')
        const files = await getAllFilesFromDesktopService(desktopId as string, c.env)
        return c.json(files, 200)

    } catch (err: any) {
        if (err.message === "No Files were found.") {
            return c.json({ error: err.message }, 404)
        }
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const getFileByIdController = async (c: Context) => {
    try {
        const fileId = c.req.param('fileId')
        const file = await getFileByIdService(fileId as string, c.env)
        return c.json(file, 200)

    } catch (err: any) {
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const getFilesFromParentController = async (c: Context) => {
    try {
        const parentId = c.req.param('parentId')
        const files = await getFilesFromParentService(parentId as string, c.env)
        return c.json(files, 200)

    } catch (err: any) {
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const getFilesFromDesktopController = async (c: Context) => {
    try {
        const desktopId = c.req.param('desktopId')
        const files = await getFilesFromDesktopService(desktopId as string, c.env)
        return c.json(files, 200)

    } catch (err: any) {
        if (err.message === "No Files were found.") {
            return c.json({ error: err.message }, 404)
        }
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const getFilesParentNamesController = async (c: Context) => {
    try {
        const parentId = c.req.param('parentId')
        const names = await getFilesParentNamesService(parentId as string, c.env)
        return c.json(names, 200)

    } catch (err: any) {
        if (err.message === "Root files have no parents.") {
            return c.json({ error: err.message }, 404)
        }
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const updateFilePositionController = async (c: Context) => {
    try {
        const files = await c.req.json()

        await updateFilePositionService(files, c.env)

        return c.json({ updated: files.length }, 200)

    } catch (err: any) {
        if (err.message === "No files received.") {
            return c.json({ error: err.message }, 404)
        }
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const deleteFileController = async (c: Context) => {
    try {
        const fileId = c.req.param('fileId')
        await deleteFileService(fileId as string, c.env)
        return c.body(null, 204)

    } catch (err: any) {
        if (err.message === "File doesn't exist.") {
            return c.json({ error: err.message }, 404)
        }
        return c.json({ error: 'Server Error' }, 500)
    }
}