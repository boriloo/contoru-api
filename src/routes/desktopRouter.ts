import { Hono } from 'hono'
import { createDesktopController, deleteDesktopController, getDesktopByIdController, getDesktopByMembershipController, getDesktopByOwnerController, getMembersFromDesktopController, getSafeDesktopByIdController, leaveDesktopController, removeMemberFromDesktopController, updateDesktopController } from "../controllers/desktopController"
import { isSingleDesktopMember, isSingleDesktopOwner } from "../middlewares/desktopMiddleware";
import { authMiddleware } from '../middlewares/authMiddleware';
import { rateLimit } from '../middlewares/rateLimitMiddleware';
import { acceptDtInviteController, createDtInviteController, deleteDtInviteController, getPendingDtInvitesController, getPendingDtInvitesFromDesktopController } from '../controllers/dtInviteController';

export const desktopRouter = new Hono()

// CREATE DESKTOP — ação rara, usuário não cria muitos desktops
desktopRouter.post("/", authMiddleware, rateLimit({
    limit: 10,
    window: 3600, // por hora
    keyPrefix: 'desktop-create'
}), createDesktopController)

// CREATE INVITE — pode convidar vários amigos seguidos
desktopRouter.post('/invite/:desktopId/:receiverId', authMiddleware, rateLimit({
    limit: 20,
    window: 3600,
    keyPrefix: 'invite-create'
}), createDtInviteController)

// GET MY PENDING INVITES — abre ao entrar no app, precisa ser generoso
desktopRouter.get('/invite', authMiddleware, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'invite-get'
}), getPendingDtInvitesController)

// GET DESKTOP PENDING INVITES — chamado ao abrir modal de convites
desktopRouter.get('/invite/:desktopId', authMiddleware, rateLimit({
    limit: 30,
    window: 60,
    keyPrefix: 'invite-get-desktop'
}), getPendingDtInvitesFromDesktopController)

// ACCEPT INVITE — ação pontual, não precisa de muitas por minuto
desktopRouter.put('/accept/:inviteId', authMiddleware, rateLimit({
    limit: 20,
    window: 3600,
    keyPrefix: 'invite-accept'
}), acceptDtInviteController)

// DELETE INVITE — pode cancelar vários convites seguidos
desktopRouter.delete('/invite/:inviteId', authMiddleware, rateLimit({
    limit: 20,
    window: 3600,
    keyPrefix: 'invite-delete'
}), deleteDtInviteController)

// GET SAFE DESKTOP BY ID — chamado frequentemente na UI
desktopRouter.get("/safe/:desktopId", authMiddleware, rateLimit({
    limit: 120,
    window: 60,
    keyPrefix: 'desktop-get-safe-id'
}), getSafeDesktopByIdController)

// GET DESKTOPS BY OWNER — chamado ao carregar o app
desktopRouter.get("/owner", authMiddleware, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'desktop-get-owner'
}), getDesktopByOwnerController)

// GET DESKTOP BY ID — chamado ao abrir configurações
desktopRouter.get("/:desktopId", authMiddleware, isSingleDesktopMember, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'desktop-get-id'
}), getDesktopByIdController)

desktopRouter.get('/members/:desktopId', authMiddleware, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'desktop-get-members'
}), getMembersFromDesktopController)

// GET DESKTOPS BY OWNER — chamado ao carregar o app
desktopRouter.get("/", authMiddleware, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'desktop-get-owner'
}), getDesktopByMembershipController)

// UPDATE DESKTOP — nome, fundo, tipo
desktopRouter.patch("/:desktopId", authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 30,
    window: 3600,
    keyPrefix: 'desktop-update'
}), updateDesktopController)

// DELETE DESKTOP — ação crítica e irreversível
desktopRouter.delete("/:desktopId", authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 5,
    window: 3600,
    keyPrefix: 'desktop-delete'
}), deleteDesktopController)

// REMOVE MEMBER — só o dono pode remover membros
desktopRouter.delete('/members/:desktopId/:userId', authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 20,
    window: 3600,
    keyPrefix: 'desktop-remove-member'
}), removeMemberFromDesktopController)

// LEAVE DESKTOP — membro sai voluntariamente
desktopRouter.delete('/leave/:desktopId', authMiddleware, rateLimit({
    limit: 10,
    window: 3600,
    keyPrefix: 'desktop-leave'
}), leaveDesktopController)