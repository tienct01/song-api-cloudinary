const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const mongoose = require("./services/mongodb.js");
const errorHanlder = require("./middlewares/errorHandler.js");
const swaggerOptions = require("./configs/swagger.js");
const songRouter = require("./routes/song.route.js");
const albumRouter = require("./routes/album.route.js");

const specs = swaggerJsDoc(swaggerOptions);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./uploads"));

app.use("/songs", songRouter);
app.use("/albums", albumRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(errorHanlder);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log("Listening to port: ", PORT);
	console.log("http://localhost:" + PORT);
});
