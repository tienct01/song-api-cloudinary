const User = require('../models/User.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function signUp(req, res, next) {
	try {
		const { name, email, password } = req.body;

		const user = await User.findOne({
			email: email,
		});
		if (!user) {
			return res.status(400).json({
				err: true,
				message: 'Email existed',
			});
		}
		const newUser = new User({
			name: name,
			email: email,
			password: password,
		});
		await newUser.save();
		return res.status(200).json({
			message: 'Success',
		});
	} catch (error) {
		next(error);
	}
}

async function signIn(req, res, next) {
	try {
		const { email, password } = req.body;
		if (email === '' || password === '') {
			return res.status(400).json({
				err: true,
				message: 'Field Required',
			});
		}
		const user = await User.findOne(
			{
				email: email,
			},
			'-playlist -__v'
		);

		if (!user) {
			return res.status(404).json({
				err: true,
				message: 'User not found',
			});
		}
		const match = await bcrypt.compare(password, user.password);

		if (!match) {
			return res.status(400).json({
				err: true,
				message: 'Password wrong',
			});
		}

		user.password = undefined;
		const accessToken = jwt.sign({ user: user }, process.env.SECRET, {
			expiresIn: '10d',
		});

		return res.status(200).json({
			accessToken: accessToken,
			user: user,
		});
	} catch (error) {
		next(error);
	}
}
async function isEmailExisted(req, res, next) {
	try {
		const { email } = req.body;
		const user = await User.findOne({
			email: email,
		});
		if (!user) {
			return res.status(404).json({
				err: true,
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

async function sendVerifyCode(req, res, next) {
	try {
		const {} = req.body;
	} catch (error) {
		next(error);
	}
}
module.exports = {
	signUp,
	isEmailExisted,
	signIn,
	sendVerifyCode,
};
