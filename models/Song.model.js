const { Schema } = require('mongoose');
const mongoose = require('mongoose');

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
	},
	{
		timestamps: true,
	}
);

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
