const mongoose = require("mongoose");
require("dotenv").config();

const connectMongo = () => {
	mongoose
		.connect(process.env.MONGO_URI, {
			dbName: process.env.DB_NAME,
		})
		.then(() => {
			console.log("DB Connected");
		})
		.catch((err) => {
			console.log("Err", err);
			setTimeout(() => connectMongo(), 2000);
		});
};
connectMongo();
module.exports = mongoose;
