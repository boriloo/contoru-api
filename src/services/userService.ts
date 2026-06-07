import { getSupabase, getSupabaseAdmin } from "../lib/supabase"
import { updateUserData, UserData } from "../types/user"

// GET ME — client normal, ok
export const getMeService = async (id: string, env: any) => {
    const supabase = getSupabase(env)
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !data) throw new Error("User doesn't exist.")
    return data as UserData
}

export const getUserEmailService = async (id: string, env: any) => {
    const supabase = getSupabase(env)
    const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('id', id)
        .single()
    if (error || !data) throw new Error("User doesn't exist.")
    return data.email;
}

// UPDATE USER — client normal, ok
export const updateUserService = async (id: string, data: updateUserData, env: any) => {

    const supabase = getSupabase(env)
    const updateData: any = {}

    if (data.name) updateData.name = data.name
    if (data.profileImage) updateData.profile_image = data.profileImage

    const { data: updated, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

    if (error || !updated) throw new Error("User not found or update failed.")
    return updated as UserData
}

// DELETE USER — precisa do admin
export const deleteUserService = async (id: string, env: any) => {
    const supabaseAdmin = getSupabaseAdmin(env)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
    if (error) throw new Error("User doesn't exist.")
}