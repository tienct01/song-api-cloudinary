const { Schema, model } = require('mongoose');
const Song = require('./Song.model.js');

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
		song: {
			type: Schema.Types.ObjectId,
			ref: 'Song',
		},
	},
	{
		timestamps: true,
		collection: 'comments',
	}
);

commentSchema.post('deleteOne', (doc, next) => {
	Song.aggregate([
		{
			$pull: {
				comments: doc._id,
			},
		},
	]);
	next();
});
const Comment = model('Comment', commentSchema);

module.exports = Comment;
