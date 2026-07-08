// services/dtInviteService.ts
import { getSupabase } from "../lib/supabase"

export const createDtInviteService = async (desktopId: string, receiverId: string, env: any) => {
    const supabase = getSupabase(env)

    const { data: existing } = await supabase
        .from('dt_invites')
        .select('id')
        .eq('desktop_id', desktopId)
        .eq('receiver_id', receiverId)
        .single()

    if (existing) throw new Error("Invite already exists.")

    const { data, error } = await supabase
        .from('dt_invites')
        .insert({
            desktop_id: desktopId,
            receiver_id: receiverId,
        })
        .select()
        .single()

    if (error) throw new Error("Failed to create invite.")
    return data
}

export const getPendingDtInvitesService = async (userId: string, env: any) => {
    const supabase = getSupabase(env)

    const { data, error } = await supabase
        .from('dt_invites')
        .select('*')
        .eq('receiver_id', userId)

    if (error) throw new Error("Failed to get invites.")
    return data
}

export const getPendingDtInvitesFromDesktopService = async (desktopId: string, env: any) => {
    const supabase = getSupabase(env)

    const { data, error } = await supabase
        .from('dt_invites')
        .select('*')
        .eq('desktop_id', desktopId)

    if (error) throw new Error("Failed to get invites.")
    return data
}

export const acceptDtInviteService = async (inviteId: string, userId: string, env: any) => {
    const supabase = getSupabase(env)

    const { data: invite, error: inviteError } = await supabase
        .from('dt_invites')
        .select('*')
        .eq('id', inviteId)
        .eq('receiver_id', userId)
        .single()

    if (inviteError || !invite) throw new Error("Invite not found.")

    const { data: desktop, error: desktopError } = await supabase
        .from('desktops')
        .select('members')
        .eq('id', invite.desktop_id)
        .single()

    if (desktopError || !desktop) throw new Error("Desktop not found.")

    const updatedMembers = [...(desktop.members || []), userId]

    const { error: updateError } = await supabase
        .from('desktops')
        .update({ members: updatedMembers })
        .eq('id', invite.desktop_id)

    if (updateError) throw new Error("Failed to update desktop members.")

    const { error: deleteError } = await supabase
        .from('dt_invites')
        .delete()
        .eq('id', inviteId)

    if (deleteError) throw new Error("Failed to delete invite.")

    return { desktopId: invite.desktop_id }
}

export const deleteDtInviteService = async (inviteId: string, env: any) => {

    const supabase = getSupabase(env)

    const { error } = await supabase
        .from('dt_invites')
        .delete()
        .eq('id', inviteId)

    if (error) throw new Error("Failed to delete invite.")
}