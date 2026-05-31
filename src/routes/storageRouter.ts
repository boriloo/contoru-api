import { Hono } from 'hono'
import { Bindings } from '../types/bindings'
import { getFileProxyController, getStorageController, uploadStorageController } from '../controllers/storageController'
import { authMiddleware } from '../middlewares/authMiddleware'

export const storageRouter = new Hono<{ Bindings: Bindings }>()

storageRouter.post('/upload', uploadStorageController)
storageRouter.get('/proxy/:key{.*}', getFileProxyController)


storageRouter.get('/:key{.+}', getStorageController)