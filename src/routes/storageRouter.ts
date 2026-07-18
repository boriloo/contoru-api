import { Hono } from 'hono'
import { Bindings } from '../types/bindings'
import { deleteStorageController, getFileProxyController, getStorageController, uploadStorageController } from '../controllers/storageController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { rateLimit } from '../middlewares/rateLimitMiddleware' // Adicionado import

export const storageRouter = new Hono<{ Bindings: Bindings }>()

// UPLOAD
storageRouter.post('/upload', authMiddleware, rateLimit({
    limit: 5,
    window: 60,
    keyPrefix: 'storage-upload'
}), uploadStorageController)

// PROXY
storageRouter.get('/proxy/:key{.*}', authMiddleware, rateLimit({
    limit: 30,
    window: 60,
    keyPrefix: 'storage-proxy'
}), getFileProxyController)

// GET
storageRouter.get('/:key{.+}', rateLimit({
    limit: 30,
    window: 60,
    keyPrefix: 'storage-get'
}), getStorageController)

// DELETE
storageRouter.delete('/:key{.+}', authMiddleware, deleteStorageController)