const express = require('express');
const { signIn, signUp } = require('../controllers/auth.controller.js');
const { validateBody, schemas } = require('../middlewares/validate.js');
const authRouter = express.Router();

authRouter.post('/login', validateBody(schemas.loginBody), signIn);
authRouter.post('/register', validateBody(schemas.loginBody), signUp);

module.exports = authRouter;
