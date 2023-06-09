const Album = require('../models/Album.model.js');
const { uploadAsset, destroyAsset } = require('../configs/cloudinaryServices.js');
const path = require('path');
const Asset = require('../models/Asset.model.js');
const { isValidObjectId } = require('mongoose');

//! [GET] /albums
async function getAllAlbums(req, res, next) {
	try {
		const albums = await Album.find().populate(['collectionImage', 'songs']);
		return res.status(200).json({
			data: albums,
		});
	} catch (error) {
		next(error);
	}
}
//! [GET] /albums/{collectionName}
async function getAlbum(req, res, next) {
	try {
		const { collectionName } = req.params;
		const album = await Album.findOne({
			collectionName: collectionName,
		}).populate('songs');

		if (!album) {
			return res.status(404).json({
				err: 'Not found',
			});
		}
		return res.status(200).json({
			data: album.audioList,
		});
	} catch (error) {
		next(error);
	}
}

//! [POST] /albums
async function createAlbum(req, res, next) {
	try {
		const { collectionName } = req.body;
		if (!collectionName)
			return res.status(400).json({
				err: 'Field Required',
			});

		let asset;
		if (req.files['collectionImage']) {
			const imageRes = await uploadAsset(path.resolve(req.files['collectionImage'][0].path));
			asset = new Asset({
				resource_type: imageRes.resource_type,
				url: imageRes.url,
				public_id: imageRes.public_id,
			});
			await asset.save();
		}
		const newAlbum = new Album({
			collectionName: collectionName,
			collectionImage: asset && asset._id,
			audioList: [],
		});
		await newAlbum.save();

		return res.status(200).json({
			data: newAlbum,
		});
	} catch (error) {
		next(error);
	}
}

//! [POST] /albums/{collectionName}
async function addAudio(req, res, next) {
	try {
		const { collectionName } = req.params;
		const { songs = [], albumName } = req.body;
		if (!collectionName) {
			return res.status(400).json({
				err: 'Field Required',
			});
		}
		for (let id of songs) {
			if (!isValidObjectId(id)) {
				return res.status(400).json({
					err: 'Invalid audio id',
				});
			}
		}
		const updatedAlbum = await Album.findOneAndUpdate(
			{
				collectionName: collectionName,
			},
			{
				songs: songs,
				collectionName: albumName,
			}
		);
		return res.status(200).json({
			data: updatedAlbum,
		});
	} catch (error) {
		next(error);
	}
}

//! [DELETE] /albums/{collectionName}
async function deleteAlbum(req, res, next) {
	try {
		const { collectionName } = req.params;
		const deletedAlbum = await Album.findOneAndDelete({
			collectionName: collectionName,
		}).populate('collectionImage');
		if (!deletedAlbum) {
			return res.status(404).json({
				err: 'Not found',
			});
		}

		if (deleteAlbum.collectionImage) {
			destroyAsset(deletedAlbum.collectionImage.public_id, 'image');
			Asset.findByIdAndDelete(deletedAlbum.collectionImage._id);
		}
		return res.staus(200).json({
			data: deletedAlbum,
		});
	} catch (error) {
		next(error);
	}
}
module.exports = {
	getAllAlbums,
	createAlbum,
	addAudio,
	getAlbum,
	deleteAlbum,
};
