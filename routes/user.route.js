const express = require('express');
const { getUsers } = require('../controllers/user.controller.js');
const userRouter = express.Router();

userRouter.get('/', getUsers);

module.exports = userRouter;
