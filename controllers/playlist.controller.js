async function createPlaylist(req, res, next) {
	try {
		const { name } = req.body;
		Playlist;
	} catch (error) {
		next(error);
	}
}

module.exports = {
	createPlaylist,
};
