import { Hono } from 'hono'
 
import { authMiddleware } from '../middlewares/authMiddleware'
import {
    createRelationController,
    getAcceptedRelationsController,
    getPendingRelationsController,
    getBlockedRelationsController,
    deleteRelationController,
} from '../controllers/relationController'
 
export const relationRouter = new Hono()
 
// CREATE NEW RELATION
relationRouter.post('/:receiverId', authMiddleware, createRelationController)
 
// GET ACCEPTED RELATIONS
relationRouter.get('/accepted', authMiddleware, getAcceptedRelationsController)
 
// GET PENDING RELATIONS
relationRouter.get('/pending', authMiddleware, getPendingRelationsController)
 
// GET BLOCKED RELATIONS
relationRouter.get('/blocked', authMiddleware, getBlockedRelationsController)
 
// DELETE RELATION
relationRouter.delete('/', authMiddleware, deleteRelationController)
 