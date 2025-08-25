const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('../models');
const { BookingRepository } = require('../repositories');
const { cancelBooking } = require('./booking');
const AppError = require('../utils/errors/appError');
const {Enums} = require('../utils/common');
const {CANCELLED, BOOKED} = Enums.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

// InmemoryDB to store idempotency keys 
// TODO: After learning docker change to redis
const inMemDB = new Set();

async function makePayment(data){
    const { bookingId, amount, userId, idempotencyKey } = data; // amount-> entered by user while he tries to pay
    const txn = await sequelize.transaction();
    try {
        // Step 1 : Check whether idempotencyKey exists
        if(inMemDB.has(idempotencyKey)) {
            throw new AppError(['Idempotency key already exists , Cannot retry on a succesfull payment'], StatusCodes.CONFLICT);
        }

        // Step 2 : Get the booking details and do some checks 
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
            await cancelBooking(bookingId);
            throw new AppError(['The booking is expired'], StatusCodes.BAD_REQUEST);
        }

        // Step 3 : Make payment

        // if payment is successful -> We need to update the status of booking from initiated to booked
        await bookingRepository.update(bookingId, {status : BOOKED}, txn);
        // if booking not succesful -> We dont mark it as cancelled, user might retry it again , ...

        await txn.commit();

        const response = { message: "Payment successful", bookingId };
        inMemDB.add(idempotencyKey);
        return response;
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