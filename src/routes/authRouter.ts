import { Hono } from 'hono'
import { authLoginController, authLogoutController, authRefreshController, authRegisterController } from "../controllers/authController"
import { Bindings } from '../types/bindings'

export const authRouter = new Hono<{ Bindings: Bindings }>()

// AUTH REGISTER
authRouter.post("/register", authRegisterController)

// AUTH LOGIN
authRouter.post("/login", authLoginController)

// AUTH REFRESH
authRouter.post("/refresh", authRefreshController)

// AUTH LOGOUT
authRouter.post("/logout", authLogoutController)