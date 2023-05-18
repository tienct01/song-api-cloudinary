const { Schema, model } = require('mongoose');

const verifyCodeSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		verifyCode: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const VerifyCode = model('VerifyCode', verifyCodeSchema);

module.exports = VerifyCode;
