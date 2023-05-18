const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerDocs = require('./configs/swagger.json');
const errorHanlder = require('./middlewares/errorHandler.js');
const songRouter = require('./routes/song.route.js');
const albumRouter = require('./routes/album.route.js');
const authRouter = require('./routes/auth.route.js');
const commentRouter = require('./routes/comment.route.js');

// Config database
require('./configs/mongodb.js');
// Config cloudinary
require('./configs/cloudinaryServices.js');
// Config passport
require('./configs/passport.js');
// Nodemailer
require('./configs/nodemailer.js');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./uploads'));

swaggerDocs.servers.shift({
	url: process.env.SERVER_URL,
	description: 'API',
});
// swagger ui
app.use('/apis', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
// song api
app.use('/songs', songRouter);
// album api
app.use('/albums', albumRouter);
// auth api
app.use('/', authRouter);
// comment api
app.use('/comments', commentRouter);

app.use(errorHanlder);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('Listening to port: ', PORT);
	console.log('http://localhost:' + PORT);
});
