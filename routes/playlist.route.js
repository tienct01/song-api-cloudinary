const express = require('express');
const passport = require('passport');
const {
	createPlaylist,
	getUserPlaylists,
	editPlaylist,
	addSongToPlaylist,
	deleteSongFromPlaylist,
	getPlaylistById,
	deletePlaylist,
} = require('../controllers/playlist.controller.js');
const { isUser } = require('../middlewares/authMiddlewares.js');
const playlistRouter = express.Router();

playlistRouter
	.route('/')
	.post([passport.authenticate('jwt', { session: false }), isUser], createPlaylist)
	.get(getUserPlaylists);

playlistRouter
	.route('/:id')
	.get(getPlaylistById)
	.patch([passport.authenticate('jwt', { session: false }), isUser], editPlaylist)
	.delete([passport.authenticate('jwt', { session: false }), isUser], deletePlaylist);

playlistRouter.route('/:id/add_song').patch([passport.authenticate('jwt', { session: false }), isUser], addSongToPlaylist);

playlistRouter.route('/:id/delete_song').patch([passport.authenticate('jwt', { session: false }), isUser], deleteSongFromPlaylist);

module.exports = playlistRouter;
