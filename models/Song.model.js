const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const Comment = require('../models/Comment.model.js');
const Asset = require('../models/Asset.model.js');
const { destroyAsset } = require('../configs/cloudinaryServices.js');

const songSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		duration: {
			type: Number,
			required: true,
		},
		artist: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		audio: {
			type: Schema.Types.ObjectId,
			ref: 'Asset',
			required: true,
		},
		downloadUrl: {
			type: String,
			required: true,
		},
		thumbnail: {
			type: Schema.Types.ObjectId,
			ref: 'Asset',
			required: true,
		},
		comment: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
		views: {
			type: Number,
			default: 0,
		},
		genre: {
			type: Schema.Types.ObjectId,
			ref: 'Genre',
		},
	},
	{
		timestamps: true,
	}
);

songSchema.post('findOneAndDelete', (doc, next) => {
	// delete all comments
	doc.comment.forEach((commentId) => {
		Comment.findOneAndDelete({
			_id: commentId,
		});
	});

	// remove asset
	Asset.findOneAndDelete({ _id: doc.audio }).then((res) => {
		destroyAsset(res.public_id, 'video');
	});
	Asset.findOneAndDelete({ _id: doc.thumbnail }).then((res) => {
		destroyAsset(res.public_id, 'image');
	});

	next();
});

// Populate single doc
songSchema.post('findOne', async (doc, next) => {
	await doc.populate('artist', 'name _id', 'User');
	await doc.populate('audio', 'url -_id', 'Asset');
	await doc.populate('thumbnail', 'url -_id', 'Asset');
	next();
});

// Populate many docs
songSchema.post('find', async (docs, next) => {
	for (let i = 0; i < docs.length; i++) {
		await docs[i].populate('artist', 'name _id', 'User');
		await docs[i].populate('audio', 'url -_id', 'Asset');
		await docs[i].populate('thumbnail', 'url -_id', 'Asset');
	}
	next();
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
