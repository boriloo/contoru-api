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

    if (error) throw new Error(error.message)
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