import { Hono } from 'hono'
import { createDesktopController, deleteDesktopController, getDesktopByIdController, getDesktopByOwnerController, updateDesktopController } from "../controllers/desktopController"
import { isSingleDesktopOwner } from "../middlewares/desktopMiddleware";
import { authMiddleware } from '../middlewares/authMiddleware';

export const desktopRouter = new Hono()

// CREATE DESKTOP
desktopRouter.post("/", authMiddleware, createDesktopController)

// GET DESKTOP BY ID
desktopRouter.get("/:desktopId", authMiddleware, isSingleDesktopOwner, getDesktopByIdController)

// GET DESKTOP BY OWNER
desktopRouter.get("/", authMiddleware, getDesktopByOwnerController)

// UPDATE DESKTOP 
desktopRouter.patch("/:desktopId", authMiddleware, isSingleDesktopOwner, updateDesktopController)

// DELETE DESKTOP
desktopRouter.delete("/:desktopId", authMiddleware, isSingleDesktopOwner, deleteDesktopController)