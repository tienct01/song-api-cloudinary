const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
	{
		public_id: {
			type: String,
			unique: true,
		},
		resource_type: {
			type: String,
			enum: ['image', 'video', 'raw'],
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
