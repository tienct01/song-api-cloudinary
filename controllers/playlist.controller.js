const { isValidObjectId } = require('mongoose');
const Playlist = require('../models/Playlist.model.js');
const Asset = require('../models/Asset.model.js');
const Song = require('../models/Song.model.js');

//! [POST] /playlists/
async function createPlaylist(req, res, next) {
	try {
		const { name } = req.body;
		const userId = req.user._id;

		const defaultAsset = await Asset.findOne({
			isDefault: true,
		});

		const newPlaylist = await Playlist.create({
			name: name,
			thumbnail: defaultAsset._id,
			user: userId,
		});

		return res.status(200).json({
			data: newPlaylist,
		});
	} catch (error) {
		next(error);
	}
}
//! [GET] /playlists
async function getUserPlaylists(req, res, next) {
	try {
		const { userId } = req.query;

		if (!isValidObjectId(userId)) {
			return res.status(400).json({
				message: 'Invalid Id',
			});
		}

		const playlists = await Playlist.find({
			user: userId,
		}).populate('thumbnail');

		return res.status(200).json({
			data: playlists,
		});
	} catch (error) {
		next(error);
	}
}

//! [GET] /playlists/{id}
async function getPlaylistById(req, res, next) {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				message: 'Invalid Id',
			});
		}
		const playlist = await Playlist.findById(id).populate('thumbnail');
		if (!playlist) {
			return res.status(404).json({
				message: 'Playlist not found',
			});
		}
		return res.status(200).json({
			data: playlist,
		});
	} catch (error) {
		next(error);
	}
}

//! [GET] /playlists/{id}/songs
async function getSongOfPlaylist(req, res, next) {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				message: 'Invalid Id',
			});
		}

		const playlist = await Playlist.findById(id, 'songs').populate({
			path: 'songs',
			populate: [
				{
					path: 'artist',
					select: 'name _id',
				},
				{
					path: 'audio',
					select: 'url createdAt',
				},
				{
					path: 'thumbnail',
					select: 'url',
				},
			],
		});

		if (!playlist) {
			return res.status(404).json({
				message: 'Playlist not found',
			});
		}

		return res.status(200).json({
			data: playlist.songs,
		});
	} catch (error) {
		next(error);
	}
}

//! [PATCH] /playlists/{id}
async function editPlaylist(req, res, next) {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const updated = await Playlist.findByIdAndUpdate(id, {
			name: name,
		});
		if (!updated) {
			return res.status(404).json({
				message: 'Playlist not found',
			});
		}

		return res.status(200).json({
			data: updated,
		});
	} catch (error) {
		next(error);
	}
}

//! [PATCH] /playlists/{id}/add_song
async function addSongToPlaylist(req, res, next) {
	try {
		const { id } = req.params;
		const { songId } = req.body;

		if (!isValidObjectId(songId)) {
			return res.status(400).json({
				message: 'Invalid song id',
			});
		}

		const playlist = await Playlist.findById(id);
		if (!playlist) {
			return res.status(404).json({
				message: 'Playlist not found',
			});
		}
		const song = await Song.findById(id).populate('thumbnail');
		if (!song) {
			return res.status(404).json({
				message: 'Song not found',
			});
		}

		// Get the thumbnail of the new song
		if (!playlist.songs.includes(songId)) {
			playlist.songs = [...playlist.songs, songId];
			playlist.thumbnail = song.thumbnail._id;
		}
		await playlist.save();

		return res.status(200).json({
			data: playlist,
		});
	} catch (error) {
		next(error);
	}
}

//! [PATCH] /playlists/{id}/delete_song
async function deleteSongFromPlaylist(req, res, next) {
	try {
		const { id } = req.params;
		const { songId } = req.body;

		if (!isValidObjectId(songId)) {
			return res.status(400).json({
				message: 'Invalid song id',
			});
		}

		const playlist = await Playlist.findById(id);
		if (!playlist) {
			return res.status(404).json({
				message: 'Playlist not found',
			});
		}
		const song = await Song.findById(playlist.songs[0]).populate('thumbnail');
		if (!song) {
			return res.status(404).json({
				message: 'Song not found',
			});
		}

		const index = playlist.songs.findIndex(songId);
		if (index !== -1) {
			playlist.songs.splice(index, 1);
			playlist.thumbnail = song.thumbnail._id;
			await playlist.save();
		}

		return res.status(200).json({
			data: playlist,
		});
	} catch (error) {
		next(error);
	}
}
module.exports = {
	createPlaylist,
	getUserPlaylists,
	getPlaylistById,
	getSongOfPlaylist,
	editPlaylist,
	addSongToPlaylist,
	deleteSongFromPlaylist,
};
