const { isValidObjectId } = require('mongoose');
const Playlist = require('../models/Playlist.model.js');
const Asset = require('../models/Asset.model.js');
const Song = require('../models/Song.model.js');

//! [POST] /playlists/
async function createPlaylist(req, res, next) {
	try {
		const { name } = req.body;
		const userId = req.user._id;

		console.log('name', name);
		const defaultAsset = await Asset.findOne({
			isDefault: true,
		});

		const newPlaylist = await Playlist.create({
			name: name || 'New Playlist',
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
		});
		playlists.forEach((val) => {
			val.depopulate('songs');
		});

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

//! [PATCH] /playlists/{id}
async function editPlaylist(req, res, next) {
	try {
		const { id } = req.params;
		const { name } = req.body;
		const userId = req.user._id;

		const playlist = await Playlist.findById(id);

		if (!playlist) {
			return res.status(404).json({
				message: 'Playlist not found',
			});
		}

		if (!playlist.user.equals(userId)) {
			return res.status(403).json({
				message: 'Forbidden',
			});
		}

		const updated = await Playlist.findByIdAndUpdate(
			id,
			{
				name: name,
			},
			{ new: true }
		);

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
		const userId = req.user._id;

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

		if (!playlist.user.equals(userId)) {
			return res.status(403).json({
				message: 'Forbidden',
			});
		}

		const song = await Song.findById(songId);
		song.depopulate();
		if (!song) {
			return res.status(404).json({
				message: 'Song not found',
			});
		}

		// Get the thumbnail of the new song
		const isSongIdExist = playlist.songs.some((id) => id.equals(songId));
		if (!isSongIdExist) {
			playlist.songs = [...playlist.songs, songId];
			playlist.thumbnail = song.thumbnail;
			await playlist.save();
		}

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
		const userId = req.user._id;

		if (!isValidObjectId(songId)) {
			return res.status(400).json({
				message: 'Invalid song id',
			});
		}

		let playlist = await Playlist.findById(id);
		if (!playlist) {
			return res.status(404).json({
				message: 'Playlist not found',
			});
		}

		if (!playlist.user.equals(userId)) {
			return res.status(403).json({
				message: 'Forbidden',
			});
		}

		const isSongIdExist = playlist.songs.some((val) => val.equals(songId));

		if (isSongIdExist) {
			playlist = await Playlist.findByIdAndUpdate(
				id,
				{
					$pull: {
						songs: songId,
					},
				},
				{ new: true }
			);

			let song = await Song.findById(playlist.songs[0]);
			if (song) {
				song.depopulate();
				playlist.thumbnail = song.thumbnail;
				await playlist.save();
			}
		}

		return res.status(200).json({
			data: playlist,
		});
	} catch (error) {
		next(error);
	}
}

//! [DELETE] /playlists/:id
async function deletePlaylist(req, res, next) {
	try {
		const { id } = req.params;
		const userId = req.user._id;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				message: 'Invalid playlist id',
			});
		}

		const playlist = await Playlist.findById(id);
		if (!playlist) {
			return res.status(404).json({
				message: 'Playlist not found',
			});
		}

		if (!playlist.user.equals(userId)) {
			return res.status(403).json({
				message: 'Forbidden',
			});
		}

		await playlist.deleteOne();

		return res.status(200).json({
			message: 'Success',
		});
	} catch (error) {
		next(error);
	}
}
module.exports = {
	createPlaylist,
	getUserPlaylists,
	getPlaylistById,
	editPlaylist,
	addSongToPlaylist,
	deleteSongFromPlaylist,
	deletePlaylist,
};
