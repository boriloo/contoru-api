import { getSupabase } from "../lib/supabase";
import { CreateFileData, FilePositionsData } from "../types/file";

// CREATE FILE
export const createFileService = async (data: CreateFileData, env: any) => {
    const supabase = getSupabase(env)
    const { data: file, error } = await supabase
        .from('files')
        .insert({
            name: data.name,
            owner_id: data.ownerId,
            desktop_id: data.desktopId,
            parent_id: data.parentId,
            file_type: data.fileType,
            xpos: data.xPos,
            ypos: data.yPos,
            url: data.url,
        })
        .select()
        .single()

    if (error) throw new Error("Failed to create file.")
    return file
}

// GET ALL FILES FROM DESKTOP
export const getAllFilesFromDesktopService = async (desktopId: string, env: any) => {
    const supabase = getSupabase(env)
    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('desktop_id', desktopId)

    if (error) throw new Error("Failed to get files.")
    return data
}

// GET ROOT FILES FROM DESKTOP
export const getFilesFromDesktopService = async (desktopId: string, env: any) => {
    const supabase = getSupabase(env)
    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('desktop_id', desktopId)
        .eq('parent_id', 'root')

    if (error) throw new Error("Failed to get files.")
    return data
}

// GET FILE BY ID
export const getFileByIdService = async (fileId: string, env: any) => {
    const supabase = getSupabase(env)
    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single()

    if (error) throw new Error("File not found.")
    return data
}

// GET FILES BY PARENT ID
export const getFilesFromParentService = async (parentId: string, env: any) => {
    const supabase = getSupabase(env)
    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('parent_id', parentId)

    if (error) throw new Error("Failed to get files.")
    return data
}

// GET PARENT NAMES (RECURSIVE)
export const getFilesParentNamesService = async (parentId: string, env: any) => {

    if (parentId === 'root') return []
    const supabase = getSupabase(env)
    const { data, error } = await supabase
        .rpc('get_parent_names', { start_id: parentId })

    if (error) throw new Error("Failed to get parent names.")
    return data
}

// UPDATE FILE POSITIONS
export const updateFilePositionService = async (files: FilePositionsData[], env: any) => {
    if (files.length < 1) throw new Error("No files received.")
    const supabase = getSupabase(env)

    const updates = files.map(file =>
        supabase
            .from('files')
            .update({ xpos: file.xPos, ypos: file.yPos })
            .eq('id', file.id)
    )

    const results = await Promise.all(updates)

    const failed = results.find(({ error }) => error)
    if (failed?.error) throw new Error("Failed to update positions.")
}

// DELETE FILE (recursivo via função SQL)
export const deleteFileService = async (id: string, env: any) => {
    const supabase = getSupabase(env)

    const { data: toDelete } = await supabase.rpc('get_all_children_ids', {
        start_id: id
    })

    await supabase.rpc('delete_file_recursive', { file_id: id })

    if (toDelete && toDelete.length > 0) {
        await Promise.all(
            toDelete.map((fileId: string) =>
                env.STORAGE.delete(`files/${fileId}.png`)
            )
        )
    }
}