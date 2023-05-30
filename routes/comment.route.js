const express = require('express');
const passport = require('passport');
const { getComments, createComment, editComment, deleteComment } = require('../controllers/comment.controller.js');
const { isUser } = require('../middlewares/authMiddlewares.js');
const commentRouter = express.Router();

commentRouter.get('/:songId', getComments);
commentRouter.post('/', [passport.authenticate('jwt', { session: false }), isUser], createComment);
commentRouter
	.route('/:commentId')
	.patch([passport.authenticate('jwt', { session: false }), isUser], editComment)
	.delete([passport.authenticate('jwt', { session: false }), isUser], deleteComment);

module.exports = commentRouter;
