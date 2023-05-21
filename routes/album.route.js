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

router.route('/:collectionName').patch(addAudio).get(getAlbum).delete(deleteAlbum);

module.exports = router;
