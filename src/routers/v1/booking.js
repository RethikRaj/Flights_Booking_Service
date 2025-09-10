const express = require('express');
const { BookingMiddlewares } = require('../../middlewares');
const { BookingController } = require('../../controllers');
const router = express.Router();

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a new flight booking
 *     description: |
 *       Create a new flight booking with distributed transaction handling.
 *       This endpoint:
 *       - Validates flight availability
 *       - Creates booking record with INITIATED status
 *       - Reserves seats in the flight service
 *       - Implements compensating transactions for failure scenarios
 *       - Calculates total cost based on flight price and seat count
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Booking'
 *             example:
 *               success: true
 *               message: "Booking created successfully"
 *               data:
 *                 id: 1
 *                 userId: 123
 *                 flightId: 456
 *                 status: "INITIATED"
 *                 noOfSeats: 2
 *                 totalCost: 11000.00
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T10:30:00.000Z"
 *               error: {}
 *       400:
 *         description: Bad request - validation failed or insufficient seats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               insufficient_seats:
 *                 summary: Insufficient Seats
 *                 value:
 *                   success: false
 *                   message: "Booking failed"
 *                   data: {}
 *                   error:
 *                     explanation: ["number of available seats is less"]
 *                     statusCode: 400
 *               validation_error:
 *                 summary: Validation Error
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   data: {}
 *                   error:
 *                     explanation: ["flightId is required", "numberOfSeats must be at least 1"]
 *                     statusCode: 400
 *       404:
 *         description: Flight not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Flight not found"
 *               data: {}
 *               error:
 *                 explanation: ["Flight does not exist"]
 *                 statusCode: 404
 *       500:
 *         description: Internal server error or external service failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Booking failed"
 *               data: {}
 *               error:
 *                 explanation: ["Service temporarily unavailable"]
 *                 statusCode: 500
 */
router.post('/', BookingMiddlewares.validateCreateRequest, BookingController.createBooking);

module.exports = router;
