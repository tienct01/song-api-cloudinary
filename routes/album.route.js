const express = require("express");
const {
	getAllAlbums,
	createAlbum,
	addAudio,
	getAlbum,
	deleteAlbum,
} = require("../controllers/album.controller.js");
const upload = require("../middlewares/multer.js");
const router = express.Router();

/**
 * @swagger
 * components:
 *    schemas:
 *      Album:
 *        type: object
 *        required:
 *          - collectionName
 *        properties:
 *          collectionName:
 *            type: string
 *            description: Album name
 *          collectionImage:
 *            type: string
 *            format: binary
 */
/**
 * @swagger
 * tags:
 *    - name: Albums
 */
/**
 * @swagger
 * paths:
 *    /albums/:
 *      get:
 *        summary: Get All albums
 *        tags:
 *          - Albums
 *        responses:
 *          200:
 *            description: success
 *      post:
 *        summary: Tao album
 *        tags:
 *          - Albums
 *        requestBody:
 *          required: true
 *          content:
 *            multipart/form-data:
 *              schema:
 *                $ref: '#components/schemas/Album'
 *        responses:
 *          200:
 *            description: success
 */
router
	.route("/")
	.get(getAllAlbums)
	.post(
		upload.fields([
			{
				name: "collectionImage",
				maxCount: 1,
			},
		]),
		createAlbum
	);

/**
 * @swagger
 * paths:
 *    /albums/{collectionName}:
 *      patch:
 *        summary: Them audio
 *        tags:
 *          - Albums
 *        parameters:
 *          - in: path
 *            name: collectionName
 *            required: true
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                audio:
 *                  type: array
 *                  items:
 *                    type: string
 *              example:
 *                audio: []
 *        responses:
 *          200:
 *            description: success
 *      get:
 *        tags:
 *          - Albums
 *        parameters:
 *          - in: path
 *            name: collectionName
 *            required: true
 *        responses:
 *          200:
 *            description: success
 *      delete:
 *        tags:
 *          - Albums
 *        parameters:
 *          - in: path
 *            name: collectionName
 *            required: true
 *        responses:
 *          200:
 *            description: success
 */

router
	.route("/:collectionName")
	.patch(addAudio)
	.get(getAlbum)
	.delete(deleteAlbum);

module.exports = router;
