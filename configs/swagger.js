const swaggerOptions = {
	definition: {
		openapi: "3.0.3",
		info: {
			title: "Song Dir API",
			description: "Chill API",
			version: "1.0.0",
		},
		servers: [
			{
				url: "http://localhost:4000",
				description: "Development Server",
			},
			{
				url: process.env.PRODUCTION_URL,
				description: "Deploy",
			},
		],
	},
	apis: ["./routes/*.js"],
};
module.exports = swaggerOptions;
