const { Schema } = require("mongoose");
const mongoose = require("../services/mongodb.js");

const songSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		duration: {
			type: Number,
			required: true,
		},
		artist: {
			type: String,
		},
		audio: {
			type: Schema.Types.ObjectId,
			ref: "Asset",
			required: true,
		},
		downloadUrl: {
			type: String,
			required: true,
		},
		album: [
			{
				type: Schema.Types.ObjectId,
				ref: "Album",
			},
		],
		thumbnail: {
			type: Schema.Types.ObjectId,
			ref: "Asset",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Song", songSchema);
