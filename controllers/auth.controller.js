const User = require('../models/User.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerifyCode, sendResetPassword, sendWaringMessage } = require('../configs/nodemailer.js');
const { generateVerifyCode, generateNewPassword, hashPassword } = require('../utils/helpers.js');
const VerifyCode = require('../models/VerifyCode.model.js');
const { destroyAsset, uploadAsset } = require('../configs/cloudinaryServices.js');
const Asset = require('../models/Asset.model.js');
const path = require('path');
const limiter = require("../middlewares/rateLimitLogin.js");

//! [POST] /register
async function signUp(req, res, next) {
	try {
		const { name, email, password } = req.body;

		const user = await User.findOne({
			email: email,
		});
		if (user) {
			return res.status(400).json({
				message: 'Email existed',
			});
		}

		const newUser = new User({
			name: name,
			email: email,
			password: password,
			verified: true,
		});

		await newUser.save();
		return res.status(200).json({
			data: newUser,
		});
	} catch (error) {
		next(error);
	}
}

//! [GET] /login
async function signIn(req, res, next) {
	try {
		// Check rate limit
		const { email, password } = req.query;
		if (email === '' || password === '') {
			return res.status(400).json({
				message: 'Field Required',
			});
		}
		const user = await User.findOne(
			{
				email: email,
			},
			'-tracks -__v -verified -role'
		);

		if (!user) {
			return res.status(404).json({
				message: "Account doesn't exist",
			});
		}
		const match = await user.comparePassword(password);

		if(req.rateLimit && req.rateLimit.remaining == 0 && user) {
			sendWaringMessage(email);
		}

		if (!match) {
			return res.status(400).json({
				message: 'Password wrong',
			});
		}

		user.password = undefined;
		const accessToken = jwt.sign({ _id: user._id, iat: Date.now() }, process.env.SECRET, {
			expiresIn: '10d',
			issuer: 'music-app',
		});

		return res.status(200).json({
			accessToken: accessToken,
			user: user,
		});
	} catch (error) {
		next(error);
	}
}
//!
async function isEmailExisted(req, res, next) {
	try {
		const { email } = req.body;
		const user = await User.findOne({
			email: email,
		});
		if (!user) {
			return res.status(404).json({
				message: 'Not Found',
			});
		}
		return res.status(200).json({
			message: 'Existed',
		});
	} catch (error) {
		next(error);
	}
}
//! [POST] /send_verify_code
async function sendVerify(req, res, next) {
	try {
		const { email } = req.query;

		const verifyCode = await VerifyCode.findOne({
			email: email,
		});
		// If verify code doesn't exist, create new one
		if (!verifyCode) {
			const newVerifyCode = await new VerifyCode({
				email: email,
				verifyCode: generateVerifyCode(),
			}).save();

			await sendVerifyCode(email, newVerifyCode.verifyCode);
			return res.status(200).json({
				message: 'Success',
			});
		}

		// Generate new verify code if email exist in database
		verifyCode.verifyCode = generateVerifyCode();
		verifyCode.save();
		await sendVerifyCode(email, verifyCode.verifyCode);
		return res.status(200).json({
			message: 'Success',
		});
	} catch (error) {
		next(error);
	}
}
//! [POST] /verify_account
async function verifyAccount(req, res, next) {
	try {
		const { email, verifyCode } = req.query;
		const code = await VerifyCode.findOne({ email: email, verifyCode: verifyCode });

		if (!code) {
			return res.status(400).json({
				message: 'Verify code wrong',
			});
		}
		// If verify code expires
		if (Date.now() - verifyCode.updatedAt > 5 * 60 * 60 * 1000) {
			return res.status(400).json({
				message: 'Verify code wrong',
			});
		}

		const user = await User.findOne({
			email: email,
		});

		if (user) {
			user.verified = true;
			user.save();
		}

		return res.status(200).json({
			message: 'Success',
		});
	} catch (error) {
		next(error);
	}
}

//! [POST] /reset_password
async function resetPassword(req, res, next) {
	try {
		const { email } = req.query;

		const user = await User.findOne({
			email: email,
		});

		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			});
		}
		const newPassword = generateNewPassword();
		user.password = newPassword;
		await user.save();
		await sendResetPassword(email, newPassword);

		return res.status(200).json({
			message: 'Success',
		});
	} catch (error) {
		next(error);
	}
}
//! [GET] /my_profile
async function myProfile(req, res, next) {
	try {
		const { id } = req.query;
		const myProfile = await User.findById(id, '-password');
		if (!myProfile) {
			return res.status(404).json({
				message: 'User not found',
			});
		}

		return res.status(200).json({
			data: myProfile,
		});
	} catch (error) {
		next(error);
	}
}
//! [PATCH] /change_password
async function changePassword(req, res, next) {
	try {
		const userId = req.user._id;
		const { oldPassword, newPassword } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			});
		}
		// Check is owner or not
		if (!user._id.equals(userId)) {
			return res.status(403).json({
				message: 'Forbidden',
			});
		}

		const isMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isMatch) {
			return res.status(400).json({
				message: 'Old password is wrong',
			});
		}

		user.password = newPassword;
		await user.save();

		return res.status(200).json({
			message: 'Success',
		});
	} catch (error) {
		next(error);
	}
}

async function updateProfile(req, res, next) {
	try {
		const { name } = req.body;
		const newAvatar = req.file;

		if (name && name?.trim() !== '') {
			req.user.name = name;
		}
		if (newAvatar) {
			destroyAsset((await Asset.findById(req.user.avatar))?.public_id).catch((err) => console.log('error', err));
			const newAvtRes = await uploadAsset(path.resolve(newAvatar.path), 'image');
			const newAvtAsset = new Asset({
				public_id: newAvtRes.public_id,
				resource_type: newAvtRes.resource_type,
				url: newAvtRes.url,
			});
			await newAvtAsset.save();
			req.user.avatar = newAvtAsset._id;
		}
		const updatedUser = await req.user.save();

		return res.status(200).json({
			message: updatedUser,
		});
	} catch (error) {
		next(error);
	}
}

module.exports = {
	signUp,
	isEmailExisted,
	signIn,
	sendVerify,
	resetPassword,
	myProfile,
	verifyAccount,
	changePassword,
	updateProfile,
};
