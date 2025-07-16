import express from 'express';
const router=express.Router();
import verifyToken from '../middlewares/verifyToken.js';
import checkAdmin from '../middlewares/checkAdmin.js';
import { ControllerAddPermission, ControllerGetAllPermissions, ControllerGetAllPermissionsFromRoleID, ControllerRemovePermission } from '../controllers/role.controller.js';

router.post('/add/:role_id',verifyToken,checkAdmin,ControllerAddPermission);
router.post('/remove/:role_id',verifyToken,checkAdmin,ControllerRemovePermission);
//router.get('/:role_id',ControllerGetAllPermissionsFromRoleID);
router.get('/',ControllerGetAllPermissions);

export default router;