const express = require('express');
const passport = require('passport');
const { getComments, createComment, editComment, deleteComment } = require('../controllers/comment.controller.js');
const { isUser, isOwner } = require('../middlewares/authMiddlewares.js');
const commentRouter = express.Router();

commentRouter.get('/:songId', getComments);
commentRouter.post('/', [passport.authenticate('jwt', { session: false }), isUser], createComment);
commentRouter
	.route('/:commentId')
	.patch([passport.authenticate('jwt', { session: false }), isOwner], editComment)
	.delete([passport.authenticate('jwt', { session: false }), isOwner], deleteComment);

module.exports = commentRouter;
