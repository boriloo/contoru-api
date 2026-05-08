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
    const { error } = await supabase
        .from('files')
        .upsert(
            files.map(file => ({
                id: file.id,
                xpos: file.xPos,
                ypos: file.yPos,
            }))
        )

    if (error) throw new Error("Failed to update positions.")
}

// DELETE FILE (recursivo via função SQL)
export const deleteFileService = async (id: string, env: any) => {
    const supabase = getSupabase(env)
    const { error } = await supabase
        .rpc('delete_file_recursive', { file_id: id })

    if (error) throw new Error("File doesn't exist.")
}