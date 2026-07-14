import { getSupabase } from "../lib/supabase"
import { CreateDesktopData } from "../types/desktop"

// CREATE DESKTOP
export const createDesktopService = async (data: CreateDesktopData, env: any) => {
    const supabase = getSupabase(env)
    const { data: desktop, error } = await supabase
        .from("desktops")
        .insert({
            name: data.name,
            owner_id: data.ownerId,
            background_image: data.backgroundImage,
            desktop_type: data.desktopType,
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    return desktop
}

// GET SAFE DESKTOP BY ID
export const getSafeDesktopByIdService = async (id: string, env: any) => {
    const supabase = getSupabase(env)
    const { data: desktop, error } = await supabase
        .from("desktops")
        .select("id, name")
        .eq("id", id)
        .single()

    if (error || !desktop) throw new Error("Desktop doesn't exist.")
    return desktop
}

// GET DESKTOP BY ID
export const getDesktopByIdService = async (id: string, env: any) => {
    const supabase = getSupabase(env)
    const { data: desktop, error } = await supabase
        .from("desktops")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !desktop) throw new Error("Desktop doesn't exist.")
    return desktop
}

// MEMBERSHIP
export const getDesktopByMembershipService = async (userId: string, env: any) => {
    const supabase = getSupabase(env)

    const { data: memberships, error: memberError } = await supabase
        .from('dt_members')
        .select('desktop_id')
        .eq('user_id', userId)

    if (memberError) throw new Error(memberError.message)
    if (!memberships || memberships.length === 0) return []

    const desktopIds = memberships.map((m: any) => m.desktop_id)

    const { data: desktops, error: desktopError } = await supabase
        .from('desktops')
        .select('*')
        .in('id', desktopIds)

    if (desktopError) throw new Error(desktopError.message)
    return desktops
}

// GET DESKTOPS BY OWNER ID
export const getDesktopByOwnerService = async (ownerId: string, env: any) => {
    const supabase = getSupabase(env)
    const { data: desktops, error } = await supabase
        .from("desktops")
        .select("*")
        .eq("owner_id", ownerId)

    if (error) throw new Error(error.message)
    return desktops
}

// UPDATE DESKTOP
export const updateDesktopService = async (id: string, data: { name?: string; backgroundImage?: string, desktopType?: string }, env: any) => {
    const supabase = getSupabase(env)
    const updateData: any = {}

    if (data.name) updateData.name = data.name
    if (data.backgroundImage) updateData.background_image = data.backgroundImage
    if (data.desktopType) updateData.desktop_type = data.desktopType

    const { data: updated, error } = await supabase
        .from("desktops")
        .update(updateData)
        .eq("id", id)
        .select()
        .single()

    if (error) throw new Error("Desktop not found or update failed.")
    return updated
}

// DELETE DESKTOP
export const deleteDesktopService = async (id: string, env: any) => {
    const supabase = getSupabase(env)

    const { error } = await supabase
        .from("desktops")
        .delete()
        .eq("id", id)

    if (error) throw new Error("Desktop doesn't exist.")
}

export const getMembersFromDesktopService = async (desktopId: string, env: any) => {
    const supabase = getSupabase(env)

    const { data, error } = await supabase
        .from('dt_members')
        .select(`
            id,
            role,
            joined_at,
            user:users!user_id(id, name, email, profile_image)
        `)
        .eq('desktop_id', desktopId)

    if (error) throw new Error(error.message)
    return data
}

// no desktopService.ts

export const removeMemberFromDesktopService = async (desktopId: string, userId: string, env: any) => {
    const supabase = getSupabase(env)

    const { error } = await supabase
        .from('dt_members')
        .delete()
        .eq('desktop_id', desktopId)
        .eq('user_id', userId)

    if (error) throw new Error("Failed to remove member.")
}

export const leaveDesktopService = async (desktopId: string, userId: string, env: any) => {
    const supabase = getSupabase(env)

    // verifica se não é o dono — dono não pode sair, só deletar
    const { data: desktop, error: desktopError } = await supabase
        .from('desktops')
        .select('owner_id')
        .eq('id', desktopId)
        .single()

    if (desktopError || !desktop) throw new Error("Desktop not found.")
    if (desktop.owner_id === userId) throw new Error("Owner cannot leave the desktop.")

    const { error } = await supabase
        .from('dt_members')
        .delete()
        .eq('desktop_id', desktopId)
        .eq('user_id', userId)

    if (error) throw new Error("Failed to leave desktop.")
}