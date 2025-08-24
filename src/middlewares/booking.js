const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/appError");

function validateCreateRequest(req,res,next){
    const {flightId, userId, numberOfSeats} = req.body;

    if(flightId && userId && numberOfSeats){
        next();
    }else{
        let explanation = [];
        if(!flightId) explanation.push('flightId not found in the incoming request');
        if(!userId) explanation.push('userId not found in the incoming request');
        // if(!numberOfSeats) explanation.push('numberOfSeats not found in the incoming request');
        ErrorResponse.error = new AppError(explanation, StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}

module.exports = {
    validateCreateRequest
}