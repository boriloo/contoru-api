export const uploadToStorageService = async (
    file: File,
    key: string,
    env: any
): Promise<string> => {
    const buffer = await file.arrayBuffer()


    const result = await env.STORAGE.put(key, buffer, {
        httpMetadata: {
            contentType: file.type,
        }
    })

    return key
}