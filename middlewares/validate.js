const joi = require('joi');

const schemas = {
	loginBody: joi.object({
		email: joi.string().email(),
		password: joi.string().min(6).max(30),
	}),
};

function validateBody(schema) {
	return (req, res, next) => {
		try {
			const { error, value } = schema.validate(req.body);

			if (error) {
				return res.status(400).json({
					err: true,
					message: error,
				});
			}
			next();
		} catch (error) {
			next(error);
		}
	};
}

module.exports = { schemas, validateBody };
