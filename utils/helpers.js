const bcrypt = require('bcrypt');

function generateVerifyCode() {
	const charSet = '1234567890';
	let verifyCode = '';
	for (let i = 0; i < 6; i++) {
		let randomIndex = Math.floor(Math.random() * 10);
		verifyCode += charSet[randomIndex];
	}
	return verifyCode;
}
function generateNewPassword() {
	const charSet = 'abcdefghjklmnopuvwsyz1234567890';
	let verifyCode = '';
	for (let i = 0; i < 6; i++) {
		let randomIndex = Math.floor(Math.random() * 10);
		verifyCode += charSet[randomIndex];
	}
	return verifyCode;
}
async function hashPassword(password) {
	// Hash password
	const salt = await bcrypt.genSalt(5);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
}

module.exports = {
	generateVerifyCode,
	generateNewPassword,
	hashPassword,
};
