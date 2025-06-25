import express from 'express';
const router=express.Router();
import { postSchema } from '../validation/post.validation.js';
import { validateBody } from '../middlewares/validate.js';
import { ControllerCreatePost, ControllerDeletePost, ControllerGetAllPosts, ControllerGetPost, ControllerUpdatePost } from '../controllers/post.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import upload from '../utils/upload.js'

router.post('/',validateBody(postSchema),verifyToken,upload.single('post'),ControllerCreatePost);
router.get('/:id',ControllerGetPost);
router.get('/users/:user_id',ControllerGetAllPosts);
router.put('/:id',verifyToken,upload.single('post'),ControllerUpdatePost);
router.delete('/:id',verifyToken,ControllerDeletePost);

export default router;