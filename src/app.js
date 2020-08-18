const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const passport = require('./loaders/passport');
const winston = require('./loaders/winston');
const apiConfig = require('./configs/api');

const formidableMiddleware = require('./middlewares/formidable');

const app = express();

app.use(cors());

app.use(compression());

app.use(morgan('combined', { stream: winston.stream }));

app.use(passport.initialize());
app.use(passport.session());

app.use(formidableMiddleware(apiConfig.formidable));

const apiRouter = require('./routers/api');

app.use('/api', apiRouter);

module.exports = app;
