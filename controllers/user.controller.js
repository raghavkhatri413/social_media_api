import { getAllPostsByUserID } from "../models/post.model.js";
import { getUserInfo, updateUserRole } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const ControllerGetUserInfo=asyncHandler(async(req ,res)=>{
    const user_id=req.params.user_id;
    const userInfo=await getUserInfo(user_id);
    if(!userInfo){
        return res.status(400).json({ error: 'User not found' });
    }
    res.json(userInfo);
});

export const ControllerGetPostOfUser=asyncHandler(async(req,res)=>{
    const user_id=req.params.user_id;
    const userInfo=await getUserInfo(user_id);
    if(!userInfo){
        return res.status(400).json({ error: 'User not found' });
    }
    const posts=await getAllPostsByUserID(user_id);
    res.json(posts);
});

export const ControllerUpdateUserRole=asyncHandler(async(req,res)=>{
    const user_id=req.params.user_id;
    const {role_id}=req.body;
    const userInfo=await getUserInfo(user_id);
    if(!userInfo){
        return res.status(400).json({ error: 'User not found' });
    }
    if(!(role_id===1 || role_id===2 || role_id===3)){
        return res.status(400).json({ error: 'Role not found' });
    }
    const updateRole=await updateUserRole(user_id,role_id);
    res.json(updateRole);
});