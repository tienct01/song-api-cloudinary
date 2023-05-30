const User = require('../models/User.model.js');

class UserServices {
	async addRecentlySong(userId, songId) {
		const user = await User.findById(userId);

		if (!user.recently.includes(songId)) {
			if (user.recently.length >= 20) {
				user.recently.splice(19, 1);
			}
			user.recently = [songId, ...user.recently];
		}

		return user.save();
	}
}

module.exports = new UserServices();
