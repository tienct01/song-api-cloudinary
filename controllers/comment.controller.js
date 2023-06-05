const { isValidObjectId } = require('mongoose');
const Song = require('../models/Song.model.js');
const Comment = require('../models/Comment.model.js');
const User = require('../models/User.model.js');

async function getComments(req, res, next) {
	try {
		const { songId } = req.params;
		if (!isValidObjectId(songId)) {
			return res.status(400).json({
				message: 'Invalid id',
			});
		}
		const comments = await Comment.find(
			{
				song: songId,
			},
			'-song'
		)
			.sort({
				createdAt: 'desc',
			})
			.populate('user', '-password -playlist -recently -tracks');

		return res.status(200).json({
			data: comments,
		});
	} catch (error) {
		next(error);
	}
}

async function createComment(req, res, next) {
	try {
		const { text, songId } = req.body;
		const userId = req.user._id;

		if (text === '' || songId === '') {
			return res.status(400).json({
				message: 'Field required',
			});
		}

		const newComment = new Comment({
			text: text,
			user: userId,
			song: songId,
		});
		await newComment.save();
		await newComment.populate('user', '-password -playlist -recently -tracks');

		return res.status(200).json({
			data: newComment,
		});
	} catch (error) {
		next(error);
	}
}

async function editComment(req, res, next) {
	try {
		const { commentId } = req.params;
		const { text } = req.body;

		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({
				message: 'Comment not found',
			});
		}

		// Check is author or not
		if (!comment.user.equals(req.user._id) && req.user.role !== 1) {
			return res.status(403).json({
				message: 'Forbidden',
			});
		}

		comment.text = text;
		await comment.save();
		await comment.populate('user', '-password -playlist -recently -tracks');

		return res.status(200).json({
			data: comment,
		});
	} catch (error) {
		next(error);
	}
}

async function deleteComment(req, res, next) {
	try {
		const { commentId } = req.params;

		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({
				message: 'Not found',
			});
		}

		// Check owner
		if (!comment.user.equals(req.user._id) && req.user.role !== 1) {
			return res.status(403).json({
				message: 'Forbidden',
			});
		}

		const deletedComment = await Comment.findByIdAndDelete(comment._id);
		return res.status(200).json({
			data: deletedComment,
		});
	} catch (error) {
		next(error);
	}
}
module.exports = {
	getComments,
	createComment,
	editComment,
	deleteComment,
};
