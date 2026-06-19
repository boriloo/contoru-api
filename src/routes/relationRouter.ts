import { Hono } from 'hono'

import { authMiddleware } from '../middlewares/authMiddleware'
import {
    createRelationController,
    getAcceptedRelationsController,
    getPendingRelationsController,
    getBlockedRelationsController,
    deleteRelationController,
    acceptRelationController, // Importe o controller de aceitar
    blockRelationController   // Importe o controller de bloquear
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

// ACCEPT RELATION
relationRouter.put('/accept/:relationId', rateLimit({
    limit: 10,
    window: 60,
    keyPrefix: 'relation-accept'
}), authMiddleware, acceptRelationController)

// BLOCK RELATION
relationRouter.put('/block/:relationId', rateLimit({
    limit: 10,
    window: 60,
    keyPrefix: 'relation-block'
}), authMiddleware, blockRelationController)

// DELETE RELATION 
relationRouter.delete('/', rateLimit({
    limit: 15,
    window: 60,
    keyPrefix: 'relation-delete'
}), authMiddleware, deleteRelationController)