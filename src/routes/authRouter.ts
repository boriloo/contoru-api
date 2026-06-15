import { Hono } from 'hono'
import { authLoginController, authLogoutController, authRefreshController, authRegisterController } from "../controllers/authController"
import { Bindings } from '../types/bindings'
import { rateLimit } from '../middlewares/rateLimitMiddleware'

export const authRouter = new Hono<{ Bindings: Bindings }>()

// AUTH REGISTER
authRouter.post("/register", rateLimit({
    limit: 50,
    window: 3600, 
    keyPrefix: 'auth-register'
}), authRegisterController)

// AUTH LOGIN
authRouter.post("/login", rateLimit({
    limit: 5,
    window: 300, 
    keyPrefix: 'auth-login'
}), authLoginController)

// AUTH REFRESH
authRouter.post("/refresh", rateLimit({
    limit: 20,
    window: 60, 
    keyPrefix: 'auth-refresh'
}), authRefreshController)

// AUTH LOGOUT
authRouter.post("/logout", rateLimit({
    limit: 5,
    window: 60, 
    keyPrefix: 'auth-logout'
}), authLogoutController)