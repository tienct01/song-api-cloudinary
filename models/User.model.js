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
		playlist: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Album',
			},
		],
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
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt(5);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

const User = model('User', userSchema);
module.exports = User;
