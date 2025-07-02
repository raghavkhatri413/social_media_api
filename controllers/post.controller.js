import { createPost, deletePost, getAllPostsByUserID, getPostByID, updatePost } from "../models/post.model.js";
import { getUserByUserID } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const ControllerCreatePost = asyncHandler(async (req, res) => {
    const { caption } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imgUrl = file.path;
    const newPost = await createPost(imgUrl, caption, req.user.user_id);
    res.status(201).json({
        message: 'Post created successfully',
        post: newPost
    });
});

export const ControllerGetPost=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    const post=await getPostByID(id);

    if (!post) {
        return res.status(400).json({ error: 'Post not found' });
    }
    res.json(post);
});

export const ControllerGetAllPosts=asyncHandler(async(req,res)=>{
    const {user_id}=req.params;
    const user=await getUserByUserID(user_id);
    if(!user){
        return res.status(400).json({ error: 'User not found' });
    }
    const posts=await getAllPostsByUserID(user_id);
    res.status(201).json({
        message: 'Posts fetched successfully',
        user_id:user_id,
        post: posts
    });
})

export const ControllerUpdatePost=asyncHandler(async(req,res)=>{
    const postID=req.params.id;
    const post=await getPostByID(postID);
    if (!post) {
        return res.status(400).json({ error: 'Post not found' });
    }
    if(req.user.user_id!==post.user_id){
        return res.status(400).json({ error: 'Unauthorized user' });
    }
    const {caption}=req.body;
    const file=req.file;
    let imgUrl=post.post;
    if(file){
        imgUrl=file.path;
    }
    const updatedPost=await updatePost(postID,imgUrl,caption);
    res.status(201).json({
        message: 'Post updated successfully',
        post: updatedPost
    });
});

export const ControllerDeletePost=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    const post=await getPostByID(id);
    if (!post) {
        return res.status(400).json({ error: 'Post not found' });
    }
    await deletePost(id);
    res.status(201).json({
        message: 'Post deleted successfully'
    });
})