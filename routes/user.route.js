const express = require('express');
const passport = require('passport');
const { getRecentlySongs } = require('../controllers/user.controller.js');
const { isUser } = require('../middlewares/authMiddlewares.js');
const userRouter = express.Router();

// userRouter.get('/recently_songs', [passport.authenticate('jwt', { session: false }), isUser], getRecentlySongs);

module.exports = userRouter;
