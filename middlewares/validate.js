const joi = require('joi');
const { isValidObjectId } = require('mongoose');

const schemas = {
	loginBody: joi.object({
		email: joi.string().email(),
		password: joi.string().min(6).max(30),
	}),
	registerBody: joi.object({
		name: joi.string(),
		email: joi.string().email(),
		password: joi.string().min(6).max(30),
	}),
	verifyBody: joi.object({
		email: joi.string().email(),
	}),
	queryId: joi.object({
		id: joi.string().custom((value, helpers) => {
			if (!isValidObjectId(value)) {
				return helpers.message('Invalid id');
			} else return true;
		}),
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

function validateQueryParams(schema) {
	return (req, res, next) => {
		try {
			const { error, value } = schema.validate({
				...req.query,
			});
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

module.exports = { schemas, validateBody, validateQueryParams };
