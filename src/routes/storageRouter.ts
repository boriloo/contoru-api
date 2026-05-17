import { Hono } from 'hono'
import { Bindings } from '../types/bindings'
import { getStorageController } from '../controllers/storageController'

export const storageRouter = new Hono<{ Bindings: Bindings }>()

storageRouter.get('/:key{.+}', getStorageController)