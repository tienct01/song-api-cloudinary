const { Schema } = require("mongoose");
const mongoose = require("../services/mongodb.js");

const albumSchema = new mongoose.Schema(
	{
		collectionName: {
			type: String,
			required: true,
			unique: true,
		},
		collectionImage: {
			type: Schema.Types.ObjectId,
			ref: "Asset",
		},
		audioList: [
			{
				type: Schema.Types.ObjectId,
				ref: "Song",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Album = mongoose.model("Album", albumSchema);
module.exports = Album;
