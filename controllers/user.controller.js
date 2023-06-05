const Song = require('../models/Song.model.js');
const User = require('../models/User.model.js');

//! [GET] /recently_songs
async function getRecentlySongs(req, res, next) {
	try {
		const id = req.user._id;
		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			});
		}
		await user.populate('recently');

		return res.status(200).json({
			data: user.recently,
		});
	} catch (error) {
		next(error);
	}
}

async function getTracks(req, res, next) {
	try {
		const id = req.user._id;
		const songs = await Song.find({
			artist: id,
		})
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

		return res.status(200).json({
			data: songs,
		});
	} catch (error) {
		next(error);
	}
}
module.exports = {
	getRecentlySongs,
	getTracks,
};
