const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises");
const removeVietnameseTones = require("../utils/removeVietnameseTones.js");

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

async function uploadAsset(link, resourceType = "image") {
	try {
		const result = await cloudinary.uploader.upload(link, {
			folder: `music/${resourceType}`,
			resource_type: resourceType,
		});
		fs.unlink(link);
		return result;
	} catch (error) {
		throw error;
	}
}
async function getAssetAttachment(
	public_id,
	fileName,
	resource_type = "video"
) {
	try {
		let newFileName = removeVietnameseTones(fileName);
		return cloudinary.url(public_id, {
			flags: `attachment:${newFileName}`,
			resource_type: resource_type,
		});
	} catch (error) {
		throw error;
	}
}
async function destroyAsset(publicId, resourceType = "image") {
	const result = await cloudinary.uploader.destroy(publicId, {
		resource_type: resourceType,
	});
	return result;
}

module.exports = { uploadAsset, destroyAsset, getAssetAttachment };
