import { Hono } from 'hono'

import { authMiddleware } from '../middlewares/authMiddleware'
import {
    createRelationController,
    getAcceptedRelationsController,
    getPendingRelationsController,
    getBlockedRelationsController,
    deleteRelationController,
} from '../controllers/relationController'
import { rateLimit } from '../middlewares/rateLimitMiddleware'

export const relationRouter = new Hono()

// CREATE NEW RELATION
relationRouter.post('/:receiverId', authMiddleware, createRelationController)

// GET ACCEPTED RELATIONS
relationRouter.get('/accepted', rateLimit({
    limit: 5,
    window: 60,
    keyPrefix: 'relations accepted'
}), authMiddleware, getAcceptedRelationsController)

// GET PENDING RELATIONS
relationRouter.get('/pending', authMiddleware, getPendingRelationsController)

// GET BLOCKED RELATIONS
relationRouter.get('/blocked', authMiddleware, getBlockedRelationsController)

// DELETE RELATION
relationRouter.delete('/', authMiddleware, deleteRelationController)
