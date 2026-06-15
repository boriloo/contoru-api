import { getSupabase } from '../lib/supabase'

// CREATE NEW RELATION
export const createRelationService = async (senderId: string, receiverId: string, env: any) => {
    const supabase = getSupabase(env)

    const { data: relation, error } = await supabase
        .from('relations')
        .insert({
            sender_id: senderId,
            receiver_id: receiverId,
            blocker_id: null,
            status: 'pending',
        })
        .select()
        .single()

    if (error) throw new Error('Failed to create relation.')
    return relation
}

// GET ACCEPTED RELATIONS
export const getAcceptedRelationsService = async (userId: string, env: any) => {
    const supabase = getSupabase(env)

    const { data: relations, error } = await supabase
        .from('relations')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq('status', 'accepted')

    if (error) throw new Error('Failed to fetch accepted relations.')
    return relations
}

export const getPendingRelationsService = async (userId: string, env: any) => {
    const supabase = getSupabase(env)

    const { data: relations, error } = await supabase
        .from('relations')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq('status', 'pending')

    if (error) throw new Error('Failed to fetch pending relations.')
    return relations
}

// GET BLOCKED RELATIONS
export const getBlockedRelationsService = async (userId: string, env: any) => {
    const supabase = getSupabase(env)

    const { data: relations, error } = await supabase
        .from('relations')
        .select('*')
        .eq('blocker_id', userId)
        .eq('status', 'blocked')

    if (error) throw new Error('Failed to fetch blocked relations.')
    return relations
}

// DELETE RELATION
export const deleteRelationService = async (userId: string, relationId: string, env: any) => {
    const supabase = getSupabase(env)

    const { data: existing, error: fetchError } = await supabase
        .from('relations')
        .select()
        .eq('id', relationId)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .single()

    if (fetchError || !existing) throw new Error('Relation not found or access denied.')

    const { error } = await supabase
        .from('relations')
        .delete()
        .eq('id', relationId)

    if (error) throw new Error('Failed to delete relation.')
}