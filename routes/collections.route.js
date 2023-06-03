const express = require('express');
const passport = require('passport');
const { getByGenre, getTopViews } = require('../controllers/song.controller.js');
const { getRecentlySongs, getTracks } = require('../controllers/user.controller.js');
const { isUser } = require('../middlewares/authMiddlewares.js');
const collectionRouter = express.Router();

collectionRouter.get('/topviews', getTopViews);

collectionRouter.get('/genre/:genre', getByGenre);

collectionRouter.get('/recently_songs', [passport.authenticate('jwt', { session: false }), isUser], getRecentlySongs);

collectionRouter.get('/my_tracks', [passport.authenticate('jwt', { session: false }), isUser], getTracks);

module.exports = collectionRouter;
