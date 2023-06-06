const express = require('express');
const passport = require('passport');
const {
	createSong,
	getAllSongs,
	deleteSong,
	getSong,
	getTopViews,
	getByGenre,
	uploadDefaultThumbnail,
	addMultipleSong,
} = require('../controllers/song.controller.js');
const { isUser, isAdmin } = require('../middlewares/authMiddlewares.js');
const { validateParams, schemas } = require('../middlewares/validate.js');
const upload = require('../middlewares/multer.js');
const router = express.Router();

router
	.route('/')
	.post(
		[passport.authenticate('jwt', { session: false }), isUser],
		upload.fields([
			{
				name: 'audio',
				maxCount: 1,
			},
			{
				name: 'thumbnail',
				maxCount: 1,
			},
		]),
		createSong
	)
	.get(getAllSongs);
router
	.route('/:id')
	.delete([validateParams(schemas.pathId, 'id')], [passport.authenticate('jwt', { session: false }), isUser], deleteSong)
	.get([validateParams(schemas.pathId, 'id')], [passport.authenticate('jwt', { session: false }), isUser], getSong);

router.post('/default_thumbnail', [passport.authenticate('jwt', { session: false }), isAdmin], upload.single('defaultThumbnail'), uploadDefaultThumbnail);

// router.post('/add_many_song', [passport.authenticate('jwt', { session: false }), isAdmin], upload.single('dataCsv'), addMultipleSong);

module.exports = router;
