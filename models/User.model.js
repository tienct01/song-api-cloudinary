const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: Schema.Types.ObjectId,
			ref: 'Asset',
		},
		verified: {
			type: Boolean,
			default: false,
		},
		// 2 - user, 1 - admin
		role: {
			type: Number,
			default: 2,
		},
		// // Bài hát đã upload của người dùng
		// tracks: [
		// 	{
		// 		type: Schema.Types.ObjectId,
		// 		ref: 'Song',
		// 	},
		// ],
		// Bài hát đã nghe gần đây
		recently: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Song',
			},
		],
	},
	{
		timestamps: true,
	}
);

const User = model('User', userSchema);
module.exports = User;
