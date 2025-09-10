const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    FLIGHT_SERVICE : process.env.FLIGHT_SERVICE,
    QUEUE_URL : process.env.QUEUE_URL,
    QUEUE_NAME : process.env.QUEUE_NAME
}