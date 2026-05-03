import { Hono } from 'hono'
import { deleteUserController, getMeController, updateUserController } from "../controllers/userController"

export const userRouter = new Hono()

// GET ALL USER DATA
userRouter.get("/me", getMeController)

// UPDATE USER DATA
// UPDATE DESKTOP 
userRouter.patch("/", updateUserController)

// DELETE USER
userRouter.delete("/", deleteUserController)

