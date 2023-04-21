const express = require("express");
const {
	createSong,
	getAllSongs,
	deleteSong,
} = require("../controllers/song.controller.js");
const upload = require("../middlewares/multer.js");
const router = express.Router();

/**
 * @swagger
 * components:
 *    schemas:
 *      Song:
 *        type: object
 *        required:
 *          - artist
 *          - audio
 *          - thumbnail
 *        properties:
 *          name:
 *            type: string
 *            description: Tên bài hát
 *          artist:
 *            type: string
 *            description: Tên của tác giả
 *          audio:
 *            type: string
 *            format: binary
 *            description: Id của asset audio
 *          thumbnail:
 *            type: string
 *            format: binary
 *            description: Id của asset image
 */

/**
 * @swagger
 * tags:
 *    - name: Songs
 */
/**
 * @swagger
 * paths:
 *    /songs/:
 *      get:
 *        summary: Lấy tất cả bài hát
 *        tags:
 *          - Songs
 *        parameters:
 *          - in: query
 *            name: q
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: success
 *      post:
 *        summary: Tạo bài hát
 *        tags:
 *          - Songs
 *        requestBody:
 *          required: true
 *          content:
 *            multipart/form-data:
 *              schema:
 *                $ref: '#/components/schemas/Song'
 *        responses:
 *          200:
 *            description: ok
 *
 */

router
	.route("/")
	.post(
		upload.fields([
			{
				name: "audio",
				maxCount: 1,
			},
			{
				name: "thumbnail",
				maxCount: 1,
			},
		]),
		createSong
	)
	.get(getAllSongs);
/**
 * @swagger
 * paths:
 *    /songs/{id}:
 *      delete:
 *        tags:
 *          - Songs
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: success
 *          404:
 *            description: not found
 */
router.route("/:id").delete(deleteSong);

module.exports = router;
