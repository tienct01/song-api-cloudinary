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
		await user.populate({
			path: 'recently',
			populate: [
				{
					path: 'artist',
					select: 'name _id',
					model: 'User',
				},
				{
					path: 'audio',
					select: 'url createdAt',
					model: 'Asset',
				},
				{
					path: 'thumbnail',
					select: 'url',
					model: 'Asset',
				},
			],
		});

		return res.status(200).json({
			data: user.recently,
		});
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getRecentlySongs,
};
