import { supabase, supabaseAdmin } from "../lib/supabase"
import { updateUserData, UserData } from "../types/user"

// GET ME — client normal, ok
export const getMeService = async (id: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !data) throw new Error("User doesn't exist.")
    return data as UserData
}

// UPDATE USER — client normal, ok
export const updateUserService = async (id: string, data: updateUserData) => {
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
export const deleteUserService = async (id: string) => {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
    if (error) throw new Error("User doesn't exist.")
}