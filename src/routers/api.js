const express = require('express');

const router = express.Router();

const authRouter = require('./v1_0/auth');
const usersRouter = require('./v1_0/users');
const listingsRouter = require('./v1_0/listings');
const enquiriesRouter = require('./v1_0/enquiries');
const rentalsRouter = require('./v1_0/rentals');
const purchaseRouter = require('./v1_0/purchases');
const chatsRouter = require('./v1_0/chats');
const filesRouter = require('./v1_0/files');
const refsRouter = require('./v1_0/refs');
const meRouter = require('./v1_0/me');

router.use('/v1_0/auth', authRouter);
router.use('/v1_0/users', usersRouter);
router.use('/v1_0/listings', listingsRouter);
router.use('/v1_0/enquiries', enquiriesRouter);
router.use('/v1_0/rentals', rentalsRouter);
router.use('/v1_0/purchases', purchaseRouter);
router.use('/v1_0/chats', chatsRouter);
router.use('/v1_0/files', filesRouter);
router.use('/v1_0/refs', refsRouter);
router.use('/v1_0/me', meRouter);

module.exports = router;
