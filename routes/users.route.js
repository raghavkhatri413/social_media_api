import express from 'express';
const router=express.Router();
import verifyToken from '../middlewares/verifyToken.js';
import { ControllerGetPostOfUser, ControllerGetUserInfo, ControllerUpdateUserRole } from '../controllers/user.controller.js';
import checkAdmin from '../middlewares/checkAdmin.js';

//router.get('/:user_id',ControllerGetUserInfo);
router.get('/:user_id/posts',ControllerGetPostOfUser);
router.put('/:user_id',verifyToken,checkAdmin,ControllerUpdateUserRole);

export default router;