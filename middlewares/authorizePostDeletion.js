import { getPostByID } from "../models/post.model.js";
import { getUserInfo } from "../models/user.model.js";


const authorizePostDeletion=async(req,res ,next)=>{
    const {post_id}=req.params;
    const post=await getPostByID(post_id);
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }
    const post_user=getUserInfo(post.user_id);
    const {role,user_id}=req.user;
    console.log({role,user_id});
    if (role === "admin" && post_user.role==="user") {
        return next(); 
    }
    if (role === "user" && post.user_id === user_id) {
        return next();
    }

    return res.status(403).json({ error: "You are not authorized to delete this Post" });
}
export default authorizePostDeletion;