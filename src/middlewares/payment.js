async function validateMakePayment(req, res, next){
    const { bookingId, amount, userId } = req.body;
    if(bookingId && amount && userId){
        next();
    }else{
        let explanation = [];
        if(!bookingId) explanation.push('bookingId not found in the incoming request');
        if(!amount) explanation.push('amount not found in the incoming request');
        if(!userId) explanation.push('userId not found in the incoming request');
        ErrorResponse.error = new AppError(explanation, StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}

module.exports = {
    validateMakePayment
}