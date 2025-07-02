import express from 'express';
const router=express.Router();
import {commentSchema} from '../validation/comment.validation.js';
import { ControllerCreateComment, ControllerDeleteComment, ControllerGetCommentByID, ControllerGetCommentsByPostID, ControllerUpdateComment } from '../controllers/comment.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import { validateBody } from '../middlewares/validate.js';
import authorizeCommentDeletion from '../middlewares/authorizeCommentDeletion.js';

router.post('/:post_id/comments',validateBody(commentSchema),verifyToken,ControllerCreateComment);
router.get('/:comment_id',ControllerGetCommentByID);
router.get('/:post_id/comments',ControllerGetCommentsByPostID);
router.put('/:comment_id',verifyToken,ControllerUpdateComment);
router.delete('/:comment_id',verifyToken,authorizeCommentDeletion,ControllerDeleteComment);

export default router;