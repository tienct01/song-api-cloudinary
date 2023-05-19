async function isAdmin(req, res, next) {
	try {
		if (!req.user) {
			return res.status(401).json({
				err: true,
				message: 'Unauthorize',
			});
		}

		if (req.user.role !== 1) {
			return res.status(401).json({
				err: true,
				message: 'Unauthorize',
			});
		}

		next();
	} catch (error) {
		next(error);
	}
}

async function isUser(req, res, next) {
	try {
		if (!req.user) {
			return res.status(401).json({
				err: true,
				message: 'Unauthorize',
			});
		}
		next();
	} catch (error) {
		next(error);
	}
}
async function isOwner(req, res, next) {
	try {
		const { id } = req.query;
		if (!req.user) {
			return res.status(401).json({
				err: true,
				message: 'Unauthorize',
			});
		}

		if (req.user._id !== id) {
			return res.status(401).json({
				err: true,
				message: 'You are not the owner',
			});
		}

		next();
	} catch (error) {
		next(error);
	}
}

module.exports = {
	isAdmin,
	isUser,
	isOwner,
};
