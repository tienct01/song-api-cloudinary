const { isValidObjectId } = require('mongoose');
const Song = require('../models/Song.model.js');

async function getComments(req, res, next) {
	try {
		const { songId } = req.params;
		if (!isValidObjectId(songId)) {
			return res.status(400).json({
				err: true,
				message: 'Id không hợp lệ !',
			});
		}
		const song = await Song.findOne({ songId: songId }).populate();
		return res.status(200).json({});
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getComments,
};
