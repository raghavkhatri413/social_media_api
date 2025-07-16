import { createPost, deletePost, getAllPosts, getAllPostsByUserID, getPostByID, updatePost } from "../models/post.model.js";
import { getUserByUserID } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import path from 'path';
import { uploadLocalImageToCloudinary } from "../utils/uploadCloudinary.js";
import { createComment } from "../models/comment.model.js";
dotenv.config();

const sendPostCreationEmail = async (userEmail, username, caption, imgUrl) => {
    const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        ignoreTLS: true
    });

    const mailOptions = {
        from: '"Postify" khatriraghav2004@gmail.com',
        to: userEmail,
        subject: 'Your Post was Created!',
        text: `Hello ${username},\n\nYour post with caption "${caption}" was successfully created!\n"${imgUrl}"\nThank you for using Postify!`
    };

    await transporter.sendMail(mailOptions);
};

export const ControllerCreateAutomatedPost = asyncHandler(async (req, res) => {
    console.log("Starting automated post creation...");

    const caption = "This is test post";
    const localImage = path.resolve('./Screenshot_1.png');
    console.log(localImage);
    const cron_user_id = process.env.CRON_USERID;

    let imgUrl;

    try {
        imgUrl = await uploadLocalImageToCloudinary(localImage);
        console.log("Uploaded to Cloudinary:", imgUrl);
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return res.status(500).json({ error: "Failed to upload image to Cloudinary" });
    }

    const newPost = await createPost(imgUrl, caption, cron_user_id);
    console.log("Automated post created");

    const test_comment="This is test comment";
    const new_comment=await createComment(test_comment,cron_user_id,newPost.post_id);
    console.log("Automated comment created");
});

export const ControllerCreatePost = asyncHandler(async (req, res) => {
    const { caption } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imgUrl = file.path;
    const newPost = await createPost(imgUrl, caption, req.user.user_id);

    const user = await getUserByUserID(req.user.user_id);

    try {
        await sendPostCreationEmail(user.email, user.username, caption, newPost.post);
        console.log(`Email sent to ${user.email}`);
    } catch (emailError) {
        console.error('Failed to send email:', emailError);
    }

    res.status(201).json({
        message: 'Post created successfully',
        post: newPost
    });
});

export const ControllerGetPost = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const post = await getPostByID(id);

    if (!post) {
        return res.status(400).json({ error: 'Post not found' });
    }
    res.json(post);
});

export const ControllerGetAllPosts = asyncHandler(async (req, res) => {
    const posts = await getAllPosts();

    if (!posts) {
        return res.status(400).json({ error: 'Post not found' });
    }
    res.json(posts);
});

export const ControllerGetAllPostsByUser = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const user = await getUserByUserID(user_id);
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }
    const posts = await getAllPostsByUserID(user_id);
    res.status(201).json({
        message: 'Posts fetched successfully',
        user_id: user_id,
        post: posts
    });
})

export const ControllerUpdatePost = asyncHandler(async (req, res) => {
    const postID = req.params.id;
    const post = await getPostByID(postID);
    if (!post) {
        return res.status(400).json({ error: 'Post not found' });
    }
    const { caption } = req.body;
    const file = req.file;
    let imgUrl = post.post;
    if (file) {
        imgUrl = file.path;
    }
    const updatedPost = await updatePost(postID, imgUrl, caption);
    res.status(201).json({
        message: 'Post updated successfully',
        post: updatedPost
    });
});

export const ControllerDeletePost = asyncHandler(async (req, res) => {
    const { post_id } = req.params;
    const post = await getPostByID(post_id);

    if (!post) {
        return res.status(400).json({ error: 'Post not found' });
    }
    await deletePost(post_id);
    res.status(201).json({
        message: 'Post deleted successfully'
    });
})