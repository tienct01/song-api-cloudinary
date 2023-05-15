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
		playlist: {
			type: Schema.Types.ObjectId,
			ref: 'Album',
			default: [],
		},
		avatar: {
			type: Schema.Types.ObjectId,
			ref: 'Asset',
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
