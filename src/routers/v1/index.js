const express = require('express');
const { PingController } = require('../../controllers');
const bookingRouter = require('./booking');
const paymentRouter = require('./payment');

const router = express.Router();

router.use('/bookings', bookingRouter);

router.use('/payments', paymentRouter);


router.get('/ping', PingController.ping);

module.exports = router;