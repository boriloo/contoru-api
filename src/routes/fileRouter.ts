import { Hono } from 'hono'
import {
    createFileController, deleteFileController, getAllFilesFromDesktopController,
    getFileByIdController, getFilesFromDesktopController, getFilesFromParentController, getFilesParentNamesController, updateFilePositionController
} from "../controllers/fileController"
import { isSingleDesktopOwner } from "../middlewares/desktopMiddleware"
import { deleteFileService } from "../services/fileService"
import { authMiddleware } from '../middlewares/authMiddleware'

export const fileRouter = new Hono()

// CREATE NEW FILE
fileRouter.post("/:desktopId", authMiddleware, isSingleDesktopOwner, createFileController)

// GET FILE BY ID
fileRouter.get("/:fileId/desktop/:desktopId", authMiddleware, isSingleDesktopOwner, getFileByIdController)

// GET FILE FROM OWNERID
fileRouter.get("/", (req, res) => {

})

// GET FILES FROM DESKTOP
fileRouter.get("/desktop/:desktopId", authMiddleware, isSingleDesktopOwner, getFilesFromDesktopController)

// GET ALL FILES FROM DESKTOP
fileRouter.get("/desktop/all/:desktopId", authMiddleware, isSingleDesktopOwner, getAllFilesFromDesktopController)

// GET FILES FROM PARENT
fileRouter.get("/desktop/:desktopId/parent/:parentId", authMiddleware, isSingleDesktopOwner, getFilesFromParentController)

// GET FILES PARENT NAMES
fileRouter.get("/desktop/:desktopId/parent-names/:parentId", authMiddleware, isSingleDesktopOwner, getFilesParentNamesController)

// UPDATE FILE POSITION
fileRouter.put("/position", updateFilePositionController)

// DELETE FILE
fileRouter.delete("/:fileId", deleteFileController)