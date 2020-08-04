const express = require('express');

const router = express.Router();

const authRouter = require('./v1_0/auth');
const usersRouter = require('./v1_0/users');
const listingsRouter = require('./v1_0/listings');
const enquiriesRouter = require('./v1_0/enquiries');
const rentalsRouter = require('./v1_0/rentals');

router.use('/v1_0/auth', authRouter);
router.use('/v1_0/users', usersRouter);
router.use('/v1_0/listings', listingsRouter);
router.use('/v1_0/enquiries', enquiriesRouter);
router.use('/v1_0/rentals', rentalsRouter);

module.exports = router;
