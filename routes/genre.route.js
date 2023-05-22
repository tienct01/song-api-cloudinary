const express = require('express');
const { getAllGenres, createGenre, addSongsToGenre } = require('../controllers/genre.controller.js');
const { validateParams, schemas, validateBody } = require('../middlewares/validate.js');
const { isAdmin } = require('../middlewares/authMiddlewares.js');
const genreRouter = express.Router();

genreRouter.route('/').get(getAllGenres).post(validateBody(schemas.createGenre), createGenre);

genreRouter.route('/:genreId').patch([validateParams(schemas.pathId, 'genreId')], isAdmin, addSongsToGenre);

module.exports = genreRouter;
