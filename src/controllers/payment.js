const { StatusCodes } = require("http-status-codes");
const { PaymentService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");


async function makePayment(req, res) {
    try {
        const response = await PaymentService.makePayment({
            bookingId : req.body.bookingId,
            amount : req.body.amount,
            userId : req.body.userId
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