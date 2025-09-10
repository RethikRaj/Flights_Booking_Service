const express = require('express');
const { PaymentMiddlewares } = require('../../middlewares');
const { PaymentController } = require('../../controllers');
const router = express.Router();

/**
 * @swagger
 * /api/v1/payments:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Process payment for a booking
 *     description: |
 *       Process payment for an existing booking with idempotency support.
 *       This endpoint:
 *       - Validates booking exists and amount matches
 *       - Supports idempotency keys to prevent duplicate payments
 *       - Updates booking status to BOOKED upon successful payment
 *       - Integrates with payment gateway simulation
 *     parameters:
 *       - in: header
 *         name: x-idempotency-key
 *         schema:
 *           type: string
 *         description: Unique key to prevent duplicate payment processing
 *         example: "idmp_1234567890abcdef"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PaymentResponse'
 *             example:
 *               success: true
 *               message: "Payment successful"
 *               data:
 *                 transactionId: "txn_1234567890"
 *                 status: "SUCCESS"
 *                 amount: 11000.00
 *                 bookingId: 1
 *               error: {}
 *       400:
 *         description: Bad request - validation failed or amount mismatch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               amount_mismatch:
 *                 summary: Amount Mismatch
 *                 value:
 *                   success: false
 *                   message: "Payment failed"
 *                   data: {}
 *                   error:
 *                     explanation: ["Payment amount does not match booking cost"]
 *                     statusCode: 400
 *               missing_idempotency:
 *                 summary: Missing Idempotency Key
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   data: {}
 *                   error:
 *                     explanation: ["Idempotency key is required"]
 *                     statusCode: 400
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Booking not found"
 *               data: {}
 *               error:
 *                 explanation: ["Booking does not exist"]
 *                 statusCode: 404
 *       409:
 *         description: Payment already processed (duplicate idempotency key)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Payment already processed"
 *               data: {}
 *               error:
 *                 explanation: ["Duplicate payment request"]
 *                 statusCode: 409
 *       500:
 *         description: Payment gateway error or internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Payment failed"
 *               data: {}
 *               error:
 *                 explanation: ["Payment gateway unavailable"]
 *                 statusCode: 500
 */
router.post('/', PaymentMiddlewares.validateMakePayment, PaymentController.makePayment);

module.exports = router;
