const express = require('express');
const passport = require('passport');
const { getAllAlbums, createAlbum, addAudio, getAlbum, deleteAlbum } = require('../controllers/album.controller.js');
const upload = require('../middlewares/multer.js');
const router = express.Router();
const { isAdmin } = require('../middlewares/authMiddlewares.js');

router
	.route('/')
	.get(getAllAlbums)
	.post(
		[passport.authenticate('jwt', { session: false }), isAdmin],
		upload.fields([
			{
				name: 'collectionImage',
				maxCount: 1,
			},
		]),
		createAlbum
	);

router
	.route('/:collectionName')
	.patch([passport.authenticate('jwt', { session: false }), isAdmin], addAudio)
	.get([passport.authenticate('jwt', { session: false }), isAdmin], getAlbum)
	.delete([passport.authenticate('jwt', { session: false }), isAdmin], deleteAlbum);

module.exports = router;
