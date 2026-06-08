import { Hono } from 'hono'
import {
    createFileController, deleteFileController, getAllFilesFromDesktopController,
    getFileByIdController, getFilesFromDesktopController, getFilesFromParentController, getFilesParentNamesController, updateFilePositionController
} from "../controllers/fileController"
import { isSingleDesktopOwner } from "../middlewares/desktopMiddleware"
import { deleteFileService } from "../services/fileService"
import { authMiddleware } from '../middlewares/authMiddleware'
import { rateLimit } from '../middlewares/rateLimitMiddleware' // Adicionado

export const fileRouter = new Hono()

// CREATE NEW FILE
fileRouter.post("/:desktopId", authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 10,
    window: 60,
    keyPrefix: 'file-create'
}), createFileController)

// GET FILE BY ID
fileRouter.get("/:fileId/desktop/:desktopId", authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'file-get-id'
}), getFileByIdController)

// GET FILES FROM DESKTOP
fileRouter.get("/desktop/:desktopId", authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'file-get-desktop'
}), getFilesFromDesktopController)

// GET ALL FILES FROM DESKTOP
fileRouter.get("/desktop/all/:desktopId", authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'file-get-all'
}), getAllFilesFromDesktopController)

// GET FILES FROM PARENT
fileRouter.get("/desktop/:desktopId/parent/:parentId", authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'file-get-parent'
}), getFilesFromParentController)

// GET FILES PARENT NAMES
fileRouter.get("/desktop/:desktopId/parent-names/:parentId", authMiddleware, isSingleDesktopOwner, rateLimit({
    limit: 60,
    window: 60,
    keyPrefix: 'file-parent-names'
}), getFilesParentNamesController)

// UPDATE FILE POSITION
fileRouter.put("/position", rateLimit({
    limit: 20,
    window: 60,
    keyPrefix: 'file-update-pos'
}), updateFilePositionController)

// DELETE FILE
fileRouter.delete("/:fileId", rateLimit({
    limit: 10,
    window: 60,
    keyPrefix: 'file-delete'
}), deleteFileController)