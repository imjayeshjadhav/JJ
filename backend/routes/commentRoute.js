import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import { createComment, deleteComment, getComments } from '../controllers/commentController.js';

const commentRouter = express.Router();

//public routes
commentRouter.get("/post/:postId", getComments)

//protected routes
commentRouter.post("/post/:postId", protectRoute, createComment);
commentRouter.delete("/:commentId", protectRoute, deleteComment);

export default commentRouter;