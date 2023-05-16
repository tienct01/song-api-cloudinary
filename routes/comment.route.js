const express = require('express');
const { getComments, createComment, editComment, deleteComment } = require('../controllers/comment.controller.js');
const commentRouter = express.Router();

commentRouter.get('/:songId', getComments);
commentRouter.post('/', createComment);
commentRouter.route('/:commentId').patch(editComment).delete(deleteComment);

module.exports = commentRouter;
