import { Hono } from 'hono'
import { deleteUserController, getMeController, updateUserController } from "../controllers/userController"
import { authMiddleware } from '../middlewares/authMiddleware'

export const userRouter = new Hono()

userRouter.use('*', authMiddleware)

// GET ALL USER DATA
userRouter.get("/me", getMeController)

userRouter.get("/email", getUserEmailController)

// UPDATE USER DATA
// UPDATE DESKTOP 
userRouter.patch("/", updateUserController)

// DELETE USER
userRouter.delete("/", deleteUserController)

