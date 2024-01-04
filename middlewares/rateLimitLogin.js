const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	skipSuccessfulRequests: true,
	requestWasSuccessful: (req, res) => res.statusCode < 400,
});

module.exports = limiter;

