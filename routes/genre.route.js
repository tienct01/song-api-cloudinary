const express = require('express');
const { getAllGenres, createGenre, addSongsToGenre } = require('../controllers/genre.controller.js');
const { schemas, validateBody } = require('../middlewares/validate.js');
const passport = require('passport');
const { isAdmin } = require('../middlewares/authMiddlewares.js');
const genreRouter = express.Router();

genreRouter
	.route('/')
	.get(getAllGenres)
	.post([passport.authenticate('jwt', { session: false }), isAdmin], validateBody(schemas.createGenre), createGenre);

module.exports = genreRouter;
