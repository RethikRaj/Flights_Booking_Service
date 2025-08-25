const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('../models');
const { BookingRepository } = require('../repositories');
const {Enums} = require('../utils/common');
const AppError = require('../utils/errors/appError');
const {CANCELLED, BOOKED} = Enums.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

async function makePayment(data){
    const { bookingId, amount, userId } = data; // amount-> entered by user while he tries to pay
    const txn = await sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId, txn);
        if(bookingDetails.status == CANCELLED){
            throw new AppError(['Booking is already cancelled'], StatusCodes.CONFLICT);
        }
        if(bookingDetails.status == BOOKED){
            throw new AppError(['Payment is already completed'], StatusCodes.CONFLICT);
        }
        if(bookingDetails.totalCost != amount){
            throw new AppError(['The amount of payment doesnot match'], StatusCodes.PAYMENT_REQUIRED);
        }
        if(bookingDetails.userId != userId){
            throw new AppError(['You are not the owner of this booking'], StatusCodes.FORBIDDEN);
        }
        const currentTime = new Date();
        const bookingTime = new Date(bookingDetails.createdAt);
        if(currentTime - bookingTime > 10 * 60 * 1000){ // 10 minutes
            // Cancel booking 

            throw new AppError(['The booking is expired'], StatusCodes.PAYMENT_REQUIRED);
        }

        // Make payment

        // if payment is successful -> We need to update the status of booking from initiated to booked
        await bookingRepository.update(bookingId, {status : BOOKED}, txn);
        // if booking not succesful -> We dont mark it as cancelled, user might retry it again , ...

        await txn.commit();
    } catch (error) {
        await txn.rollback();
        if(error instanceof AppError){
            throw error;
        }
        // To get the error thrown from the other microservice , do as below
        throw new AppError(error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    makePayment
}