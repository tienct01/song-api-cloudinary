const User = require('../models/User.model.js');

class UserServices {
	async addRecentlySong(userId, songId) {
		const user = await User.findById(userId);

		if (!user.recently.includes(songId)) {
			if (user.recently.length >= 20) {
				user.recently.splice(19, 1);
			}
			user.recently = [songId, ...user.recently];
		} else {
			const index = user.recently.indexOf(songId);
			user.recently.splice(index, 1);
			user.recently = [songId, ...user.recently];
		}

		return user.save();
	}
}

module.exports = new UserServices();
