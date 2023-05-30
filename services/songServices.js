const Song = require('../models/Song.model.js');
const User = require('../models/User.model.js');

class SongServices {
	async getTopSongs() {
		const songs = await Song.find()
			.sort({ views: 'desc' })
			.limit(10)
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
		return songs;
	}
}

module.exports = new SongServices();
