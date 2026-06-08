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
relationRouter.post('/:receiverId', rateLimit({
    limit: 5,
    window: 60,
    keyPrefix: 'relation-create'
}), authMiddleware, createRelationController)

// GET ACCEPTED RELATIONS 
relationRouter.get('/accepted', rateLimit({
    limit: 10,
    window: 60,
    keyPrefix: 'relations-accepted'
}), authMiddleware, getAcceptedRelationsController)

// GET PENDING RELATIONS 
relationRouter.get('/pending', rateLimit({
    limit: 10,
    window: 60,
    keyPrefix: 'relations-pending'
}), authMiddleware, getPendingRelationsController)

// GET BLOCKED RELATIONS 
relationRouter.get('/blocked', rateLimit({
    limit: 10,
    window: 60,
    keyPrefix: 'relations-blocked'
}), authMiddleware, getBlockedRelationsController)

// DELETE RELATION 
relationRouter.delete('/', rateLimit({
    limit: 15,
    window: 60,
    keyPrefix: 'relation-delete'
}), authMiddleware, deleteRelationController)