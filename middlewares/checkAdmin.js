import { getRole } from "../models/role.model.js";

const checkAdmin=async(req,res ,next)=>{
    const {role_id}=req.user;
    const {role_name}=await getRole(role_id);
    if (role_name === "admin") {
        return next(); 
    }
    return res.status(403).json({ error: "You are not authorized to perform this task" });
}
export default checkAdmin;