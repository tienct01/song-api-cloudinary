const Song = require('../models/Song.model.js');
const { uploadAsset, getAssetAttachment, destroyAsset } = require('../configs/cloudinaryServices.js');
const path = require('path');
const Asset = require('../models/Asset.model.js');

async function getAllSongs(req, res, next) {
	try {
		const { q = '' } = req.query;
		const songs = await Song.find({})
			.sort({
				updatedAt: 'desc',
			})
			.populate(['audio', 'thumbnail'])
			.or([
				{
					name: { $regex: `${q}`, $options: 'i' },
				},
				{
					artist: { $regex: `${q}`, $options: 'i' },
				},
			]);
		return res.json({
			data: songs,
		});
	} catch (error) {
		next(error);
	}
}
async function createSong(req, res, next) {
	try {
		const { name, artist, album = [] } = req.body;
		if (!artist) {
			return res.status(400).json({
				err: 'Field required',
			});
		}
		if (!req.files['thumbnail']) {
			return res.status(400).json({
				err: 'Thumbnail required',
			});
		}
		if (!req.files['audio']) {
			return res.status(400).json({
				err: 'Audio required',
			});
		}
		const thumbnailRes = await uploadAsset(path.resolve(req.files['thumbnail'][0].path), 'image');
		const audioRes = await uploadAsset(path.resolve(req.files['audio'][0].path), 'video');

		let thumbnailAsset = new Asset({
			resource_type: thumbnailRes.resource_type,
			url: thumbnailRes.url,
			public_id: thumbnailRes.public_id,
		});
		await thumbnailAsset.save();

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
			album: album,
			audio: audioAsset._id,
			thumbnail: thumbnailAsset._id,
			downloadUrl: await getAssetAttachment(audioRes.public_id, name || req.files['audio'][0].originalname),
		});
		await newSong.save();
		return res.json({
			data: newSong,
		});
	} catch (error) {
		next(error);
	}
}

async function deleteSong(req, res, next) {
	try {
		const { id } = req.params;
		const deletedSong = await Song.findByIdAndDelete(id).populate(['audio', 'thumbnail']);
		if (!deletedSong) {
			return res.status(404).json({
				err: 'Not Found',
			});
		}
		destroyAsset(deletedSong.audio.public_id, 'video');
		destroyAsset(deletedSong.thumbnail.public_id, 'image');
		return res.status(200).json({
			data: deletedSong,
		});
	} catch (error) {
		next(error);
	}
}
module.exports = {
	createSong,
	getAllSongs,
	deleteSong,
};
