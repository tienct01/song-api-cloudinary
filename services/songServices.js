const Song = require('../models/Song.model.js');
const User = require('../models/User.model.js');

class SongServices {
	async getTopSongs() {
		const songs = await Song.find().sort({ views: 'desc' }).limit(10);
		return songs;
	}
}

module.exports = new SongServices();
