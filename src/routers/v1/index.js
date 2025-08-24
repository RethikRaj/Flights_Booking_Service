const express = require('express');
const { PingController } = require('../../controllers');
const bookingRouter = require('./booking');

const router = express.Router();

router.use('/bookings', bookingRouter);


router.get('/ping', PingController.ping);

module.exports = router;