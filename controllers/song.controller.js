const Song = require('../models/Song.model.js');
const { uploadAsset, getAssetAttachment, destroyAsset } = require('../configs/cloudinaryServices.js');
const path = require('path');
const Asset = require('../models/Asset.model.js');
const songServices = require('../services/songServices.js');
const userServices = require('../services/userServices.js');
const { isValidObjectId } = require('mongoose');

//! [GET] /songs
async function getAllSongs(req, res, next) {
	try {
		const { q = '', page = 1, limit = 5 } = req.query;
		const songs = await Song.find()
			.or([
				{
					'artist.name': { $regex: q, $options: 'i' },
				},
				{
					name: { $regex: q, $options: 'i' },
				},
			])
			.sort({
				updatedAt: 'desc',
			})
			.skip((page - 1) * limit)
			.limit(limit)
			.populate({
				path: 'artist',
				select: 'name _id',
			})
			.populate({
				path: 'audio',
				select: 'url createdAt',
			})
			.populate({
				path: 'thumbnail',
				select: 'url',
			});

		const songCount = await Song.count().exec();
		let totalPage;
		if (songCount % limit !== 0) {
			totalPage = Math.floor(songCount / limit) + 1;
		} else {
			totalPage = Math.floor(songCount / limit);
		}

		return res.json({
			totalPage: totalPage,
			data: songs,
		});
	} catch (error) {
		next(error);
	}
}

//! [GET] /songs/{id}
async function getSong(req, res, next) {
	try {
		const { id } = req.params;
		const userId = req.user._id;
		const song = await Song.findById(id);

		if (!song) {
			return res.status(404).json({
				message: 'Not found',
			});
		}
		// Add to recently list of user
		userServices.addRecentlySong(userId, song._id);
		// Increase view of song when user listen
		song.views++;
		await song.save();

		return res.status(200).json({
			data: song,
		});
	} catch (error) {
		next(error);
	}
}

//! [POST] /songs
async function createSong(req, res, next) {
	try {
		const { name, genreId } = req.body;
		const artist = req.user._id;

		if (!isValidObjectId(genreId)) {
			return res.status(400).json({
				message: 'Invalid id',
			});
		}
		if (!req.files['audio']) {
			return res.status(400).json({
				err: 'Audio required',
			});
		}

		let thumbnailAsset;
		if (req.files['thumbnail']) {
			const thumbnailRes = await uploadAsset(path.resolve(req.files['thumbnail'][0].path), 'image');
			thumbnailAsset = new Asset({
				resource_type: thumbnailRes.resource_type,
				url: thumbnailRes.url,
				public_id: thumbnailRes.public_id,
			});
			await thumbnailAsset.save();
		} else {
			thumbnailAsset = await Asset.findOne({
				isDefault: true,
			});
		}

		const audioRes = await uploadAsset(path.resolve(req.files['audio'][0].path), 'video');

		let audioAsset = new Asset({
			resource_type: audioRes.resource_type,
			url: audioRes.url,
			public_id: audioRes.public_id,
		});
		await audioAsset.save();

		let newSong = new Song({
			name: name || req.files['audio'][0].originalname,
			artist: artist || 'Unknown',
			duration: audioRes.duration,
			audio: audioAsset._id,
			thumbnail: thumbnailAsset._id,
			downloadUrl: await getAssetAttachment(audioRes.public_id, name || req.files['audio'][0].originalname),
			genre: genreId,
		});
		await newSong.save();
		return res.json({
			data: newSong,
		});
	} catch (error) {
		next(error);
	}
}

//! [DELETE] /songs/{id}
async function deleteSong(req, res, next) {
	try {
		const { id } = req.params;
		const song = await Song.findById(id);

		if (!song) {
			return res.status(404).json({
				err: 'Not Found',
			});
		}

		// Check artist
		if (req.user._id !== song.artist && req.user.role !== 1) {
			return res.status(403).json({
				message: 'Forbidden',
			});
		}

		const deletedSong = await Song.findByIdAndDelete(id);
		destroyAsset(deletedSong.audio.public_id, 'video');
		destroyAsset(deletedSong.thumbnail.public_id, 'image');

		Asset.findByIdAndDelete(deletedSong.audio._id);
		Asset.findByIdAndDelete(deletedSong.thumbnail._id);

		return res.status(200).json({
			data: deletedSong,
		});
	} catch (error) {
		next(error);
	}
}

//! [GET] /songs/topviews
async function getTopViews(req, res, next) {
	try {
		const topSong = await songServices.getTopSongs();

		return res.status(200).json({
			data: topSong,
		});
	} catch (error) {
		next(error);
	}
}

//! [GET] /songs/genre/{genre}
async function getByGenre(req, res, next) {
	try {
		const { genre } = req.params;

		let song = await Song.aggregate([
			{
				$lookup: {
					from: 'genres',
					localField: 'genre',
					foreignField: '_id',
					as: 'genre',
				},
			},
			{
				$match: {
					'genre.genreName': genre,
				},
			},
		]);

		return res.status(200).json({
			data: song,
		});
	} catch (error) {
		next(error);
	}
}

async function uploadDefaultThumbnail(req, res, next) {
	try {
		const file = req.file;
		if (!file) {
			return res.status(400).json({
				message: 'Image required',
			});
		}

		const info = await uploadAsset(path.resolve(file.path), 'image');
		const newAsset = new Asset({
			public_id: info.public_id,
			isDefault: true,
			resource_type: info.resource_type,
			url: info.url,
		});
		await newAsset.save();

		return res.status(200).json({
			data: newAsset,
		});
	} catch (error) {
		next(error);
	}
}
module.exports = {
	createSong,
	getAllSongs,
	getTopViews,
	getSong,
	deleteSong,
	getByGenre,
	uploadDefaultThumbnail,
};
