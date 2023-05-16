const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { generateVerifyCode } = require('../utils/helpers.js');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GOOGLE_USER,
		pass: process.env.GOOGLE_APP_PASSWORD,
	},
});

async function sendVerifyCode(email) {
	try {
		const html = await ejs.renderFile(path.resolve(process.cwd(), '/assets/verifyCode.ejs'), {
			verifyCode: generateVerifyCode(),
		});
		transporter.sendMail({
			from: process.env.GOOGLE_USER,
			to: email,
			html: html,
			subject: 'Music App',
		});
	} catch (error) {
		throw error;
	}
}

async function sendResetPassword(email, newPassword) {
	try {
		const html = await ejs.renderFile(path.resolve(process.cwd(), '/assets/resetPass.ejs'), {
			resetPassword: newPassword,
		});
		transporter.sendMail({
			from: process.env.GOOGLE_USER,
			to: email,
			html: html,
			subject: 'Music App',
		});
	} catch (error) {
		throw error;
	}
}
module.exports = {
	sendVerifyCode,
	sendResetPassword,
};
