const express = require('express');
const { signIn, signUp, sendVerify, resetPassword, myProfile, verifyAccount, changePassword } = require('../controllers/auth.controller.js');
const { validateBody, schemas, validateQueryParams } = require('../middlewares/validate.js');
const authRouter = express.Router();

authRouter.get('/login', validateQueryParams(schemas.loginBody), signIn);
authRouter.post('/register', validateBody(schemas.registerBody), signUp);
authRouter.post('/send_verify_code', validateQueryParams(schemas.verifyBody), sendVerify);
authRouter.post('/reset_password', validateQueryParams(schemas.verifyBody), resetPassword);
authRouter.post('/verify_account', verifyAccount);
authRouter.patch('/change_password/:id', validateQueryParams(schemas.queryId), changePassword);
authRouter.get('/my_profile', validateBody(schemas.queryId), myProfile);

module.exports = authRouter;
