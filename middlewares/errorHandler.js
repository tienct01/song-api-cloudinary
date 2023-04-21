const errorHanlder = (err, req, res, next) => {
	if (err) {
		console.log(err);
		return res.status(500).json({
			err: err,
		});
	}
};
module.exports = errorHanlder;
