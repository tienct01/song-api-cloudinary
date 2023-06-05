const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
	thumbnail: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Asset',
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	songs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Song',
		},
	],
});

playlistSchema.post('find', async (docs, next) => {
	for (let doc of docs) {
		if (doc) {
			await doc.populate('songs');
			await doc.populate('thumbnail', 'url -_id');
		}
	}
	next();
});
playlistSchema.post('findOne', async (doc, next) => {
	if (doc) {
		await doc.populate('songs');
		await doc.populate('thumbnail', 'url -_id');
	}
	next();
});
playlistSchema.post('save', async (doc, next) => {
	if (doc) {
		console.log('docsss', doc);
		await doc.populate('songs');
		await doc.populate('thumbnail', 'url -_id');
	}
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
