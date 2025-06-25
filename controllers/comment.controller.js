import { createComment, deleteComment, getCommentByID, getCommentsByPostID, updateComment } from "../models/comment.model.js";
import { getPostByID } from "../models/post.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const ControllerCreateComment=asyncHandler(async(req,res)=>{
    const{comment_text}=req.body;
    const {post_id}=req.params;
    if(!comment_text){
        return res.status(400).json({ error: 'Comment is empty' });
    }
    if(!post_id){
        return res.status(400).json({ error: 'Post undefined' });
    }

    const newComment=await createComment(comment_text,req.user.user_id,post_id);
    res.status(201).json({
        message: 'Comment created successfully',
        post: newComment
    });
})

export const ControllerGetCommentByID=asyncHandler(async(req,res)=>{
    const {comment_id}=req.params;
    const comment=await getCommentByID(comment_id);
    if(!comment){
        return res.status(400).json({ error: 'Comment not found' });
    }
    res.status(201).json({
        message: 'Comment fetched successfully',
        comment: comment
    });
});

export const ControllerGetCommentsByPostID=asyncHandler(async(req,res)=>{
    const {post_id}=req.params;
    const post=await getPostByID(post_id);
    if(!post){
        return res.status(400).json({ error: 'Post not found' });
    }
    const comments=await getCommentsByPostID(post_id);
    res.status(201).json({
        message: 'Comment fetched successfully',
        comments: comments
    });
});

export const ControllerUpdateComment=asyncHandler(async(req,res)=>{
    const {comment_text}=req.body;
    const {comment_id}=req.params;
    const comment=await getCommentByID(comment_id);
    if(!comment_text){
        return res.status(400).json({ error: 'Comment is empty' });
    }
    if(!comment){
        return res.status(400).json({ error: 'Comment not found' });
    }
    if(req.user.user_id!==comment.user_id){
        return res.status(400).json({ error: 'Unauthorized user' });
    }
    const updatedComment=await updateComment(comment_text,comment_id);
    res.status(201).json({
        message: 'Comment updated successfully',
        post: updatedComment
    });
});

export const ControllerDeleteComment=asyncHandler(async(req,res)=>{
    const {comment_id}=req.params;
    console.log(comment_id);
    const comment=await getCommentByID(comment_id);
    console.log(comment);
    if(!comment){
        return res.status(400).json({ error: 'Comment not found' });
    }
    if(req.user.user_id!==comment.user_id){
        return res.status(400).json({ error: 'Unauthorized user' });
    }
    await deleteComment(comment_id);
    res.status(201).json({
        message: 'Comment deleted successfully'
    });
});