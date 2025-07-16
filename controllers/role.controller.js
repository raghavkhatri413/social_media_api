import { addPermission, getAllPermissions, getAllPermissionsFromRoleID, getPermissionByID, removePermission } from "../models/permission.model.js";
import { getAllRoles, getRole, getRolePermission } from "../models/role.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const ControllerAddPermission = asyncHandler(async (req, res) => {
    const { permission_id } = req.body;
    const { role_id } = req.params;
    const permission = await getPermissionByID(permission_id);
    const role = await getRole(role_id);
    if (!permission) {
        return res.status(400).json({ error: 'Permission not found' });
    }
    if (!role) {
        return res.status(400).json({ error: 'Role not found' });
    }
    const check_permission=await getRolePermission(permission_id,role_id);
    if(check_permission){
        return res.status(400).json({ error: 'Permission already exist' });
    }
    const new_permission = await addPermission(permission_id, role_id);
    res.json(new_permission);
});

export const ControllerRemovePermission = asyncHandler(async (req, res) => {
    const { permission_id } = req.body;
    const { role_id } = req.params;
    const permission = await getPermissionByID(permission_id);
    const role = await getRole(role_id);
    if (!permission || !role) {
        return res.status(400).json({ error: 'Role or Permission not found' });
    }
    const check_permission=await getRolePermission(permission_id,role_id);
    if(!check_permission){
        return res.status(400).json({ error: 'Permission does not exist' });
    }
    await removePermission(permission_id, role_id);
    res.status(201).json({
        message: 'Permission deleted successfully'
    });
}); 

export const ControllerGetAllRoles = asyncHandler(async (req, res) => {
    const roles=await getAllRoles();
    res.json(roles);
});

export const ControllerGetAllPermissions = asyncHandler(async (req, res) => {
    const permissions=await getAllPermissions();
    res.json(permissions);
});

export const ControllerGetAllPermissionsFromRoleID = asyncHandler(async (req, res) => {
    const {role_id}=req.params;
    const permissions=await getAllPermissionsFromRoleID(role_id);
    res.json(permissions);
});