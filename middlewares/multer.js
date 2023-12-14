const multer = require('multer');
const path = require('path');
const fs = require('fs');

const diskStorage = multer.diskStorage({
	filename: (req, file, cb) => {
		file.originalname = Buffer.from(path.parse(file.originalname).name, 'latin1').toString('utf8');
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix);
	},
	destination: (req, file, cb) => {
		if(!fs.existsSync(path.join(__dirname) + '/uploads')) {
			fs.mkdirSync(path.join(__dirname), 'uploads');
		}
		cb(null, 'uploads');
	},
});
const upload = multer({
	storage: diskStorage,
});
module.exports = upload;
