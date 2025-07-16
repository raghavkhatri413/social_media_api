import express from 'express';
const router=express.Router();
import { ControllerCreateComment, ControllerGetCommentsByPostID } from '../controllers/comment.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import checkCommentPermission from '../middlewares/checkCommentPermission.js';
import { validateBody } from '../middlewares/validate.js';
import { commentSchema } from '../validation/comment.validation.js';

router.post('/:post_id/comments',verifyToken,checkCommentPermission('create','Comment'),validateBody(commentSchema),verifyToken,ControllerCreateComment);
router.get('/:post_id/comments',verifyToken,checkCommentPermission('read','Comment'),ControllerGetCommentsByPostID);

export default router;