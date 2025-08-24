const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/appError");
const axios  = require("axios");
const {sequelize} = require('../models');
const {BookingRepository} = require('../repositories');
const { ServerConfig } = require('../config')

const bookingRepository = new BookingRepository();

async function createBooking(data){
    const {flightId, numberOfSeats, userId} = data;
    const txn = await sequelize.transaction();

    try {
        
        // Step 1 : Get the flight
        const flightDetails= await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${flightId}`);
        const flight = flightDetails.data.data;

        // Step 2 : Check whether the flight exists or not => This is handled in repository layer . 
        
        // Step 3: Check whether the remaining seats in flights >= numberOfSeats , if not thrown an error
        if(flight.remainingSeats < numberOfSeats){
            throw new AppError(['number of available seats is less'], StatusCodes.BAD_REQUEST);
        }

        // Step 4 : Create the booking 
        const totalCost = flight.price * numberOfSeats;
        const bookingPayload = {flightId, userId, noOfSeats : numberOfSeats, totalCost};
        const booking = await bookingRepository.create(bookingPayload, txn);

        // Step 5 : reduce the number of seats
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${flightId}/seats`, {
            numberOfSeats : numberOfSeats
        });

        await txn.commit();

        return booking;
    } catch (error) {
        console.log(error);
        await txn.rollback();
        if(error instanceof AppError){
            throw error;
        }
        // To get the error thrown from the other microservice , do as below
        throw new AppError(error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createBooking
}