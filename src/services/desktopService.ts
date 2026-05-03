import { supabase } from "../lib/supabase"
import { CreateDesktopData } from "../types/desktop"

// CREATE DESKTOP
export const createDesktopService = async (data: CreateDesktopData) => {
    const { data: desktop, error } = await supabase
        .from("desktops")
        .insert({
            name: data.name,
            owner_id: data.ownerId,
            background_image: data.backgroundImage,
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return desktop
}

// GET DESKTOP BY ID
export const getDesktopByIdService = async (id: string) => {
    const { data: desktop, error } = await supabase
        .from("desktops")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !desktop) throw new Error("Desktop doesn't exist.")
    return desktop
}

// GET DESKTOPS BY OWNER ID
export const getDesktopByOwnerService = async (ownerId: string) => {
    const { data: desktops, error } = await supabase
        .from("desktops")
        .select("*")
        .eq("owner_id", ownerId)

    if (error) throw new Error(error.message)
    return desktops
}

// UPDATE DESKTOP
export const updateDesktopService = async (id: string, data: { name?: string; backgroundImage?: string }) => {
    const updateData: any = {}

    if (data.name) updateData.name = data.name
    if (data.backgroundImage) updateData.background_image = data.backgroundImage

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
export const deleteDesktopService = async (id: string) => {
    // files deletam em cascata automaticamente pelo ON DELETE CASCADE
    const { error } = await supabase
        .from("desktops")
        .delete()
        .eq("id", id)

    if (error) throw new Error("Desktop doesn't exist.")
}