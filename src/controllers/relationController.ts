import { Context } from 'hono'
import {
    createRelationService,
    getAcceptedRelationsService,
    getPendingRelationsService,
    getBlockedRelationsService,
    deleteRelationService,
    acceptRelationService,
    blockRelationService
} from '../services/relationService'

// CREATE NEW RELATION
export const createRelationController = async (c: Context) => {
    try {
        const senderId = c.get('userId') as string
        const receiverId = c.req.param('receiverId')

        if (senderId === receiverId) return c.json({ error: 'Same person' }, 500)

        const relation = await createRelationService(senderId, receiverId as string, c.env)

        return c.json(relation, 201)
    } catch (err: any) {
        return c.json({ error: err.message }, 500)
    }
}

// GET ACCEPTED RELATIONS
export const getAcceptedRelationsController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string

        const relations = await getAcceptedRelationsService(userId, c.env)

        return c.json(relations, 200)
    } catch (err: any) {
        return c.json({ error: err.message }, 500)
    }
}

// GET PENDING RELATIONS
export const getPendingRelationsController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string

        const relations = await getPendingRelationsService(userId, c.env)

        return c.json(relations, 200)
    } catch (err: any) {
        return c.json({ error: err.message }, 500)
    }
}

// GET BLOCKED RELATIONS
export const getBlockedRelationsController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string

        const relations = await getBlockedRelationsService(userId, c.env)

        return c.json(relations, 200)
    } catch (err: any) {
        return c.json({ error: err.message }, 500)
    }
}

// ACCEPT RELATION
export const acceptRelationController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string
        const relationId = c.req.param('relationId')

        const relation = await acceptRelationService(userId, relationId, c.env)

        return c.json(relation, 200)
    } catch (err: any) {
        return c.json({ error: err.message }, 500)
    }
}

// BLOCK RELATION
export const blockRelationController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string
        const relationId = c.req.param('relationId')

        const relation = await blockRelationService(userId, relationId, c.env)

        return c.json(relation, 200)
    } catch (err: any) {
        return c.json({ error: err.message }, 500)
    }
}

// DELETE RELATION
export const deleteRelationController = async (c: Context) => {
    try {
        const userId = c.get('userId') as string
        const { relationId } = await c.req.json()

        await deleteRelationService(userId, relationId, c.env)

        return c.json({ message: 'Relation deleted successfully.' }, 200)
    } catch (err: any) {
        return c.json({ error: err.message }, 500)
    }
}