const { StatusCodes } = require("http-status-codes");
const { PaymentService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");


async function makePayment(req, res) {
    try {
        // Extract user email from headers (injected by API Gateway)
        const userEmail = req.headers['x-user-email'];
        
        const response = await PaymentService.makePayment({
            bookingId : req.body.bookingId,
            amount : req.body.amount,
            userId : req.body.userId,
            idempotencyKey : req.headers['x-idempotency-key'],
            userEmail : userEmail
        });

        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    makePayment
}