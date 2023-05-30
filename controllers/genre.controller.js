const { isValidObjectId } = require('mongoose');
const Genre = require('../models/Genre.model.js');

//! [GET] /genres
async function getAllGenres(req, res, next) {
	try {
		const genres = await Genre.find();
		return res.status(200).json({
			data: genres,
		});
	} catch (error) {
		console.log('Genre error', error);
		next(error);
	}
}

//! [POST] /genres
async function createGenre(req, res, next) {
	try {
		const { genreName } = req.body;
		const newGenre = new Genre({
			genreName: genreName,
		});
		await newGenre.save();
		return res.status(200).json({
			data: newGenre,
		});
	} catch (error) {
		console.log('Genre error', error);
		next(error);
	}
}

module.exports = { getAllGenres, createGenre };
