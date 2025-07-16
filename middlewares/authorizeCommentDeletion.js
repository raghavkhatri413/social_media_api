import { getCommentByID } from "../models/comment.model.js";
import { getUserInfo } from "../models/user.model.js";

const authorizeCommentDeletion=async(req,res ,next)=>{
    const {comment_id}=req.params;
    const comment=await getCommentByID(comment_id);
    if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
    }
    const {role,user_id}=req.user;
    const post_user=await getUserInfo(comment.user_id);
    if (role === "admin" && post_user.role==="user") {
        return next(); 
    }
    if (role === "moderator" && post_user.role==="user") {
        return next(); 
    }
    if (role === "user" && comment.user_id === user_id) {
        return next();
    }

    return res.status(403).json({ error: "You are not authorized to delete this comment" });
}
export default authorizeCommentDeletion;