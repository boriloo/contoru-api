type StatusType = 'accepted' | 'pending' | 'blocked' 

export type DesktopData = {
    id: string,
    senderId: string,
    receiverId: string,
    blockerId: string,
    status: StatusType,
    createdAt: Date
}