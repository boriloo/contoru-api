import { Context } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { authLoginService, authRefreshService, authRegisterService, authLogoutService, authGoogleUrlService, authForgotPasswordService, authResetPasswordService } from "../services/authService"
import { LoginData, RegisterData } from "../types/auth"

function daysInSeconds(num: number) {
    return num * 24 * 60 * 60
}

export const authRegisterController = async (c: Context) => {
    try {
        const { name, email, password } = await c.req.json()

        if (!name || !email || !password) {
            return c.json({ error: "Missing fields." }, 400)
        }

        const user = await authRegisterService({ name, email, password } as RegisterData, c.env)

        return c.json(user, 201)

    } catch (err: any) {
        if (err.message === 'User already exists.') {
            return c.json({ error: err.message }, 400)
        }
        console.error(err)
        return c.json({ error: "Server Error." }, 500)
    }
}

export const authLoginController = async (c: Context) => {
    try {
        const { email, password, rememberMe } = await c.req.json()

        if (!email || !password || typeof rememberMe !== 'boolean') {
            return c.json({ error: "Missing fields." }, 400)
        }

        const data = await authLoginService({ email, password, rememberMe } as LoginData, c.env)

        const isProduction = c.env.ENVIRONMENT === 'production'

        if (rememberMe && data.session?.refresh_token) {
            setCookie(c, 'refreshCookie', data.session.refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
            })
        }

        return c.json({
            user: data.user,
            token: data.session?.access_token,
        }, 201)

    } catch (err: any) {
        if (err.message === 'Invalid email or password.') {
            return c.json({ error: err.message }, 400)
        }
        console.error(err)
        return c.json({ error: "Server Error." }, 500)
    }
}

export const authRefreshController = async (c: Context) => {
    const allCookies = c.req.header('cookie')
    console.log('todos os cookies recebidos:', allCookies)

    const refreshToken = getCookie(c, 'refreshCookie')
    console.log('refreshToken:', refreshToken)

    if (!refreshToken) {
        return c.json({ error: "Refresh token not found" }, 401)
    }

    try {
        const data = await authRefreshService(refreshToken, c.env)
        console.log('refresh bem sucedido:', data)
        return c.json(data, 200)
    } catch (err) {
        console.log('erro no refresh:', err)
        return c.json({ error: "Session expired" }, 401)
    }
}

export const authLogoutController = async (c: Context) => {
    try {
        await authLogoutService(c.env)

        deleteCookie(c, 'refreshCookie', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
        })

        return c.json({ message: 'User logged out' }, 200)
    } catch (err) {
        return c.json({ error: err }, 500)
    }
}

export const authGoogleUrlController = async (c: Context) => {
    try {
        const url = await authGoogleUrlService(c.env)
        return c.json({ url }, 200)
    } catch (err) {
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const setRefreshController = async (c: Context) => {
    try {
        const { refreshToken } = await c.req.json()
        if (!refreshToken) return c.json({ error: 'Missing token' }, 400)

        setCookie(c, 'refreshCookie', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        })

        return c.json({ ok: true }, 200)
    } catch (err) {
        console.error(err)
        return c.json({ error: 'Server Error' }, 500)
    }
}

export const authForgotPasswordController = async (c: Context) => {
    try {
        const { email } = await c.req.json()
        if (!email) return c.json({ error: "Missing email." }, 400)

        await authForgotPasswordService(email, c.env)
        return c.json({ message: "Password reset email sent." }, 200)
    } catch (err: any) {
        console.error(err)
        return c.json({ error: "Server Error." }, 500)
    }
}

export const authResetPasswordController = async (c: Context) => {
    try {
        const { accessToken, newPassword } = await c.req.json()
        if (!accessToken || !newPassword) return c.json({ error: "Missing fields." }, 400)

        await authResetPasswordService(accessToken, newPassword, c.env)
        return c.json({ message: "Password reset successfully." }, 200)
    } catch (err: any) {
        if (err.message === "Invalid or expired token.") {
            return c.json({ error: err.message }, 401)
        }
        console.error(err)
        return c.json({ error: "Server Error." }, 500)
    }
}