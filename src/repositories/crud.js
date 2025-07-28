const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/appError");

class CrudRepository {
    constructor(model){
        this.model = model;
    }

    async create(data){
        const response = await this.model.create(data);
        return response;
    }

    async destroy(id){
        const response = await this.model.destroy({
            where : {
                id : id
            }
        });
        if(!response){
            throw new AppError(['Not able to find the resource'], StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async get(id){
        const response = await this.model.findByPk(id);
        // If no entry with the given id
        // Why implemented here instead of service layer ? -> This is a common thing that can occur across multiple models so instead of handling it in each service we can handle it here.
        if (!response){
            throw new AppError(['Not able to find the resource'], StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async getAll(){
        const response = await this.model.findAll();
        return response;
    }

    async update(id, data){ // data -> {col : value}
        const response = await this.model.update(data, {
            where : {
                id : id
            }
        });
        if(response[0] == 0){
            throw new AppError(['Not able to find the resource'], StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = CrudRepository;