import { getPostByID } from "../models/post.model.js";


const authorizePostDeletion=async(req,res ,next)=>{
    const {post_id}=req.params;
    const post=getPostByID(post_id);
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }
    const {role,user_id}=req.user;
    if (role === "admin") {
        return next(); 
    }
    if (role === "user" && post.user_id === user_id) {
        return next();
    }

    return res.status(403).json({ error: "You are not authorized to delete this Post" });
}
export default authorizePostDeletion;