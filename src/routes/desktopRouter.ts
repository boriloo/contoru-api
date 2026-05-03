import { Hono } from 'hono'
import { createDesktopController, deleteDesktopController, getDesktopByIdController, getDesktopByOwnerController, updateDesktopController } from "../controllers/desktopController"
import { isSingleDesktopOwner } from "../middlewares/desktopMiddleware";

export const desktopRouter = new Hono()

// CREATE DESKTOP
desktopRouter.post("/", createDesktopController)

// GET DESKTOP BY ID
desktopRouter.get("/:desktopId", isSingleDesktopOwner, getDesktopByIdController)

// GET DESKTOP BY OWNER
desktopRouter.get("/", getDesktopByOwnerController)

// UPDATE DESKTOP 
desktopRouter.patch("/:desktopId", isSingleDesktopOwner, updateDesktopController)

// DELETE DESKTOP
desktopRouter.delete("/:desktopId", isSingleDesktopOwner, deleteDesktopController)