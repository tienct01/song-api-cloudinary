async function isAdmin(req, res, next) {
	try {
		if (req.user.role !== 1) {
			return res.status(401).json({
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
		if (!req.user.verified) {
			return res.status(401).json({
				message: 'Email not confirmed yet',
			});
		}
		next();
	} catch (error) {
		next(error);
	}
}
async function isOwner(req, res, next) {
	try {
		const { id } = req.query || req.params;
		// User is admin or owner
		if (req.user._id !== id && req.user.role !== 1) {
			return res.status(401).json({
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
