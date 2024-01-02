const express = require('express');
const { signIn, signUp, sendVerify, resetPassword, myProfile, verifyAccount, changePassword, updateProfile } = require('../controllers/auth.controller.js');
const passport = require('passport');
const { validateBody, schemas, validateQueryParams } = require('../middlewares/validate.js');
const { isUser } = require('../middlewares/authMiddlewares.js');
const upload = require('../middlewares/multer.js');
const authRouter = express.Router();
const limiter = require("../middlewares/rateLimitLogin.js");

authRouter.get('/login', validateQueryParams(schemas.loginBody), limiter, signIn);
authRouter.post('/register', validateBody(schemas.registerBody), signUp);
authRouter.post('/send_verify_code', validateQueryParams(schemas.verifyBody), sendVerify);
authRouter.post('/reset_password', validateQueryParams(schemas.verifyBody), resetPassword);
authRouter.post('/verify_account', verifyAccount);
authRouter.patch(
	'/change_password',
	[validateQueryParams(schemas.queryId), validateBody(schemas.changePasswordBody)],
	[passport.authenticate('jwt', { session: false }), isUser],
	changePassword
);
authRouter.get('/my_profile', validateQueryParams(schemas.queryId), myProfile);
authRouter.patch('/update_profile', [passport.authenticate('jwt', { session: false }), isUser], upload.single('avatar'), updateProfile);

module.exports = authRouter;
