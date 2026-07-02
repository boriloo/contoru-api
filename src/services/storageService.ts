export const uploadToStorageService = async (
    file: File,
    key: string,
    env: any
): Promise<string> => {
    const buffer = await file.arrayBuffer()

    await env.STORAGE.put(key, buffer, {
        httpMetadata: {
            contentType: file.type,
        }
    })

    return key
}

export const deleteFromStorageService = async (
    key: string,
    env: any
): Promise<void> => {
    await env.STORAGE.delete(key)
}