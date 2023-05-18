const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GOOGLE_USER,
		pass: process.env.GOOGLE_APP_PASSWORD,
	},
});

async function sendVerifyCode(email, verifyCode) {
	try {
		const html = await ejs.renderFile(path.resolve(process.cwd(), 'assets/verifyCode.ejs'), {
			verifyCode: verifyCode,
		});
		return transporter.sendMail({
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
		const html = await ejs.renderFile(path.resolve(process.cwd(), 'assets/resetPass.ejs'), {
			resetPassword: newPassword,
		});
		return transporter.sendMail({
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
