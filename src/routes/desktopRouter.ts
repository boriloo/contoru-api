import { Hono } from 'hono'
import { createDesktopController, deleteDesktopController, getDesktopByIdController, getDesktopByOwnerController, updateDesktopController } from "../controllers/desktopController"
import { isSingleDesktopOwner } from "../middlewares/desktopMiddleware";
import { authMiddleware } from '../middlewares/authMiddleware';
import { rateLimit } from '../middlewares/rateLimitMiddleware'; // Adicionado
import { acceptDtInviteController, createDtInviteController, deleteDtInviteController, getPendingDtInvitesController, getPendingDtInvitesFromDesktopController } from '../controllers/dtInviteController';

export const desktopRouter = new Hono()

// CREATE DESKTOP
desktopRouter.post("/", authMiddleware, rateLimit({
    limit: 5,
    window: 60,
    keyPrefix: 'desktop-create'
}), createDesktopController)

// GET DESKTOP BY ID
desktopRouter.get("/:desktopId", authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'desktop-get-id'
}), getDesktopByIdController)

// GET DESKTOP BY OWNER
desktopRouter.get("/", authMiddleware, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'desktop-get-owner'
}), getDesktopByOwnerController)

// UPDATE DESKTOP
desktopRouter.patch("/:desktopId", authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 30,
    window: 60,
    keyPrefix: 'desktop-update'
}), updateDesktopController)

// DELETE DESKTOP
desktopRouter.delete("/:desktopId", authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 5,
    window: 60,
    keyPrefix: 'desktop-delete'
}), deleteDesktopController)

// CREATE NEW DESKTOP INVITE
desktopRouter.post('/invite/:desktopId/:receiverId', rateLimit({
    limit: 5, window: 60, keyPrefix: 'invite-create'
}), authMiddleware, createDtInviteController)

// GET MY PENDING INVITES
desktopRouter.get('/invite', rateLimit({
    limit: 10, window: 60, keyPrefix: 'invite-get'
}), authMiddleware, getPendingDtInvitesController)

// GET DESKTOP PENDING INVITES
desktopRouter.get('/invite/:desktopId', rateLimit({
    limit: 10, window: 60, keyPrefix: 'invite-get'
}), authMiddleware, getPendingDtInvitesFromDesktopController)

//
desktopRouter.put('/accept/:inviteId', rateLimit({
    limit: 10, window: 60, keyPrefix: 'invite-accept'
}), authMiddleware, acceptDtInviteController)

desktopRouter.delete('/invite/:inviteId', rateLimit({
    limit: 15, window: 60, keyPrefix: 'invite-delete'
}), authMiddleware, deleteDtInviteController)