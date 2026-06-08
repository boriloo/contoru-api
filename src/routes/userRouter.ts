import { Hono } from 'hono'
import { deleteUserController, getMeController, getUserEmailController, updateUserController } from "../controllers/userController"
import { authMiddleware } from '../middlewares/authMiddleware'
import { rateLimit } from '../middlewares/rateLimitMiddleware'

export const userRouter = new Hono()

userRouter.use('*', authMiddleware)

// GET ALL USER DATA
userRouter.get("/me", rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'user-me'
}), getMeController)

userRouter.get("/email", rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'user-email'
}), getUserEmailController)

// UPDATE USER DATA
userRouter.patch("/", rateLimit({
    limit: 20,
    window: 60,
    keyPrefix: 'user-update'
}), updateUserController)

// DELETE USER
userRouter.delete("/", rateLimit({
    limit: 5,
    window: 60,
    keyPrefix: 'user-delete'
}), deleteUserController)