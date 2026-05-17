

// type DesktopMember = {
//     id: string,
//     name: string,
//     joinedAt: string,
// }

export type DesktopData = {
    id: string,
    name: string,
    ownerId: string,
    backgroundUrl: string,
    createdAt: Date,
    desktopType: string,
    members: string[]
}

export type CreateDesktopData = {
    name: string,
    ownerId: string,
    backgroundImage: string,
    desktopType: string,
    members: string[]
}