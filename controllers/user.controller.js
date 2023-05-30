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

module.exports = {
	getRecentlySongs,
};
