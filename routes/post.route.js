import express from 'express';
const router=express.Router();
import { postSchema } from '../validation/post.validation.js';
import { validateBody } from '../middlewares/validate.js';
import { ControllerCreatePost, ControllerDeletePost, ControllerGetAllPosts, ControllerGetAllPostsByUser, ControllerGetPost, ControllerUpdatePost } from '../controllers/post.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import upload from '../utils/upload.js'
import checkPostPermission from '../middlewares/checkPostPermission.js';

router.post('/create',validateBody(postSchema),verifyToken,checkPostPermission('create','Post'),upload.single('post'),ControllerCreatePost);
//router.get('/:id',verifyToken,checkPostPermission('read','Post'),ControllerGetPost);
router.get('/',verifyToken,checkPostPermission('read','Post'),ControllerGetAllPosts);
router.get('/users/:user_id',verifyToken,checkPostPermission('read','Post'),ControllerGetAllPostsByUser);
router.put('/:id',verifyToken,upload.single('post'),checkPostPermission('update','Post'),ControllerUpdatePost);
router.delete('/:post_id',verifyToken,checkPostPermission('delete','Post'),ControllerDeletePost);

export default router;