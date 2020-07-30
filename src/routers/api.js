const express = require('express');

const router = express.Router();

const authRouter = require('./v1_0/auth');
const usersRouter = require('./v1_0/users');

router.use('/v1_0/auth', authRouter);
router.use('/v1_0/users', usersRouter);

module.exports = router;
