const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema(
	{
		genreName: {
			type: String,
			required: true,
			unique: true,
		},
		songs: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Song',
			},
		],
	},
	{
		versionKey: false,
	}
);
const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
