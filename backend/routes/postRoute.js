import express from "express"
import { createPost, deletePost, getPost, getPosts, getUserPosts } from "../controllers/postController.js";
import { protectRoute } from "../middleware/authMiddleware.js"

const postRouter = express.Router()

// public routes
postRouter.get("/", getPosts)
postRouter.get("/:postId", getPost)
postRouter.get("/user/:username", getUserPosts)

// protected routes
postRouter.post("/", protectRoute, createPost);
postRouter.delete("/:postId", protectRoute, deletePost )

export default postRouter;