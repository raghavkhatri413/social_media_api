import express from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller.js';
const router=express.Router();
import { userSchema } from '../validation/user.validation.js';
import { validateBody } from '../middlewares/validate.js';

router.post('/register',validateBody(userSchema),registerUser);
router.post('/login',loginUser);

export default router;