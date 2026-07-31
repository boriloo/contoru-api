import { getSupabase } from "../lib/supabase";
import { LoginData, RegisterData } from "../types/auth";

export const authRegisterService = async ({ name, email, password }: RegisterData, env: any) => {
    const supabase = getSupabase(env)

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    })

    if (error) {
        if (error.message.toLowerCase().includes('already registered') ||
            error.message.toLowerCase().includes('already exists')) {
            throw new Error('User already exists.')
        }
        throw new Error(error.message)
    }


    if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error('User already exists.')
    }

    return data
}

export const authLoginService = async ({ email, password }: LoginData, env: any) => {
    const supabase = getSupabase(env)

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) throw new Error("Invalid email or password.")
    return data
}

export const authRefreshService = async (refreshToken: string, env: any) => {
    const supabase = getSupabase(env)

    const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
    })

    if (error) throw new Error("Invalid refresh token")
    return data
}

export const authLogoutService = async (env: any) => {
    const supabase = getSupabase(env)

    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
}

export const authGoogleUrlService = async (env: any) => {
    const redirectTo = encodeURIComponent(`${env.FRONTEND_URL}/auth/callback`)
    return `${env.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`
}

export const authForgotPasswordService = async (email: string, env: any) => {
    const supabase = getSupabase(env)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${env.FRONTEND_URL}/auth/reset-password`
    })

    if (error) throw new Error(error.message)
}

export const authResetPasswordService = async (accessToken: string, newPassword: string, env: any) => {
    const supabase = getSupabase(env)

    const { error: userError } = await supabase.auth.getUser(accessToken)
    if (userError) throw new Error("Invalid or expired token.")

    const { error } = await supabase.auth.admin.updateUserById(
        (await supabase.auth.getUser(accessToken)).data.user!.id,
        { password: newPassword }
    )

    if (error) throw new Error("Failed to reset password.")
}