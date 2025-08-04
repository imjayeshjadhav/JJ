import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js";
import { deleteNotification, getNotifications } from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/", protectRoute, getNotifications);
notificationRouter.delete("/:notificationId", protectRoute, deleteNotification);

export default notificationRouter;