const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../utils/helpers.js');

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
			default: true,
		},
		// 2 - user, 1 - admin
		role: {
			type: Number,
			default: 2,
		},
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

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	this.password = await hashPassword(this.password);
});

userSchema.methods.comparePassword = function (password) {
	return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);
module.exports = User;
