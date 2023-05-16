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

module.exports = {
	generateVerifyCode,
	generateNewPassword,
};
