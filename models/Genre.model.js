const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema(
	{
		genreName: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{
		versionKey: false,
	}
);
const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
