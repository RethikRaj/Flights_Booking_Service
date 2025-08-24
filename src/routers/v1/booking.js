const express = require('express');
const { BookingMiddlewares } = require('../../middlewares');
const { BookingController } = require('../../controllers');
const router = express.Router();

// api/v1/bookings/...

// POST : /api/v1/bookings/
router.post('/', BookingMiddlewares.validateCreateRequest, BookingController.createBooking);


module.exports = router;