const CrudRepository = require("./crud");

const {Booking} = require('../models');

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    async create(data, transaction){
        const response = await Booking.create(data, {transaction : transaction});
        return response;
    }

    async get(id, transaction){
        const response = await Booking.findByPk(id, {transaction : transaction});
        if (!response){
            throw new AppError(['Not able to find the resource'], StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id, data, transaction){
        const response = await Booking.update(data, {
            where : {
                id : id
            },
            transaction : transaction
        });
        if(response[0] == 0){
            throw new AppError(['Not able to find the resource'], StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = BookingRepository;