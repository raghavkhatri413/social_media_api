import express from 'express';
const router=express.Router();
import { ControllerGetAllRoles } from '../controllers/role.controller.js';

router.get('/',ControllerGetAllRoles);

export default router;