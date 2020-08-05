const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const passport = require('./loaders/passport');
const winston = require('./loaders/winston');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(compression());

app.use(morgan('combined', { stream: winston.stream }));

app.use(passport.initialize());
app.use(passport.session());

const apiRouter = require('./routers/api');

app.use('/api', apiRouter);

module.exports = app;
