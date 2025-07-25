import express from "express"
import { followUser, getCurrentUser, getUserProfile, syncUser, updateProfile } from "../controllers/userController.js"
import { protectRoute } from "../middleware/authMiddleware.js"
import upload from "../middleware/uploadMiddleware.js"

const userRouter = express.Router()

userRouter.get("/profile/:username", getUserProfile)
userRouter.post("/sync", protectRoute, syncUser)
userRouter.post("/me", protectRoute, getCurrentUser)

//Update profile => auth
userRouter.put("/profile", protectRoute, updateProfile)
userRouter.post("/follow/:targetUserId",protectRoute, upload.single("image"), followUser )


export default userRouter