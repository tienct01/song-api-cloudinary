const { isValidObjectId } = require('mongoose');
const Song = require('../models/Song.model.js');
const Comment = require('../models/Comment.model.js');
const User = require('../models/User.model.js');

async function getComments(req, res, next) {
	try {
		const { songId } = req.params;
		if (!isValidObjectId(songId)) {
			return res.status(400).json({
				err: true,
				message: 'Invalid id',
			});
		}
		const song = await Song.findById(songId, {
			comment: true,
		}).populate({
			path: 'comment',
			populate: {
				path: 'user',
				select: '_id name',
			},
		});

		if (!song) {
			return res.status(404).json({
				err: true,
				message: 'Not found',
			});
		}
		return res.status(200).json({
			data: song.comment,
		});
	} catch (error) {
		next(error);
	}
}

async function createComment(req, res, next) {
	try {
		const { text, userId, songId } = req.body;

		if (text === '' || songId === '' || userId === '') {
			return res.status(400).json({
				err: true,
				message: 'Field required',
			});
		}
		const song = await Song.findById(songId);
		if (!song) {
			return res.status(404).json({
				err: true,
				message: 'Song not found',
			});
		}
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				err: true,
				message: 'User not found',
			});
		}

		const newComment = new Comment({
			text: text,
			user: userId,
		});
		await newComment.save();

		song.comment.push(newComment);
		await song.save();

		return res.status(200).json({
			data: song,
		});
	} catch (error) {
		next(error);
	}
}

async function editComment(req, res, next) {
	try {
		const { commentId } = req.params;
		const { text } = req.body;

		const comment = await Comment.findByIdAndUpdate(commentId, {
			text: text,
		});

		if (!comment) {
			return res.status(404).json({
				err: true,
				message: 'Comment not found',
			});
		}

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

		const deletedComment = await Comment.findByIdAndDelete(commentId);

		if (!deletedComment) {
			return res.status(404).json({
				err: true,
				message: 'Not found',
			});
		}
		return res.status(200).json({
			data: deteledComment,
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
