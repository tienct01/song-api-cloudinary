const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
		collection: 'comments',
	}
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;
