import asyncHandler from "express-async-handler"
import Comment from "../models/commentModel.js"
import { getAuth } from "@clerk/express"
import User from "../models/userModel.js"
import Post from "../models/postModel.js"
import Notification from "../models/notificationModel.js"

export const getComments = asyncHandler(async (req, res) => {
    const {postId} = req.params

    const comments = await Comment.find({ post : postId })
    .sort({ createdAt: -1})
    .populate("user", "username firstName lastName profilePicture")

    res.status(200).json({comments})
})

export const createComment = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req)
    const {postId} = req.params;
    const {content} = req.body;
    
    if(!content || content.trim() === "") {
        res.status(400).json({message: "Content is required"})
        return;
    }

    const user = await User.findById({clerkId : userId});
    const post = await Post.findById(postId);

    if(!user || !post) {
        res.status(404).json({message: "User or Post not found"})
        return;
    }

    const comment = await Comment.create({
        user: user._id,
        post : postId,
        content,
    });

    // link comment to user and post
    await Post.findByIdAndUpdate(postId, {
        $push: { comments: comment._id }    
    });

    // create notification for the post author
    if (post.user.toString() !== user._id.toString()) {
        await Notification.create({
            from : user._id,
            to: post.user,
            type: "comment",
            post: postId,
            comment: comment._id,
        })
    }

    res.status(201).json({comment});

})

export const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const {userId} = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    const comment = await Comment.findById(commentId)

    if (!user || !comment) {
        res.status(404).json({ message: "User or Comment not found" });
        return;
    }

    if (comment.user.toString() !== user._id.toString()) {
        res.status(403).json({ message: "You are not authorized to delete this comment" });
        return;
    }

    // remove the comment from the post
    await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: commentId }
    });

    // delete the comment
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted successfully" });

})