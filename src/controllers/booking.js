const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services');
const { ErrorResponse, SuccessResponse } = require('../utils/common');
const AppError = require('../utils/errors/appError');

async function createBooking(req, res){
    try {
        console.log("Inside controller");
        const response = await BookingService.createBooking({
            flightId : req.body.flightId,
            userId : req.body.userId,
            numberOfSeats : req.body.numberOfSeats
        });
        SuccessResponse.data = response;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        console.log("Inside error controller ", error);
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    createBooking
};