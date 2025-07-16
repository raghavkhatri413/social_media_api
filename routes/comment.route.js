import express from 'express';
const router=express.Router();
import {commentSchema} from '../validation/comment.validation.js';
import { ControllerCreateComment, ControllerDeleteComment, ControllerGetCommentByID, ControllerUpdateComment } from '../controllers/comment.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import { validateBody } from '../middlewares/validate.js';
import checkCommentPermission from '../middlewares/checkCommentPermission.js';

//router.post('/:post_id/comments',verifyToken,checkCommentPermission('create','Comment'),validateBody(commentSchema),verifyToken,ControllerCreateComment);
router.get('/:comment_id',verifyToken,checkCommentPermission('read','Comment'),ControllerGetCommentByID);
router.put('/:comment_id',verifyToken,checkCommentPermission('update','Comment'),ControllerUpdateComment);
router.delete('/:comment_id',verifyToken,checkCommentPermission('delete','Comment'),ControllerDeleteComment);

export default router;