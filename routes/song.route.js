const express = require('express');
const passport = require('passport');
const { createSong, getAllSongs, deleteSong } = require('../controllers/song.controller.js');
const { isUser, isOwner } = require('../middlewares/authMiddlewares.js');
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
router.route('/:id').delete([passport.authenticate('jwt', { session: false }), isOwner], deleteSong);

module.exports = router;
