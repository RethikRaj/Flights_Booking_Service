const amqplib = require('amqplib');
const ServerConfig = require('./serverConfig');

let channel, connection;

async function connectQueue() {
    try {
        connection = await amqplib.connect(ServerConfig.QUEUE_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(ServerConfig.QUEUE_NAME);
    } catch(error) {
        console.log(error);
        throw error;
    }
}

async function sendData(data) {
    try {
        await channel.sendToQueue(ServerConfig.QUEUE_NAME, Buffer.from(JSON.stringify(data)));
    } catch(error) {
        console.log("queue error", error);
        throw error;
    }
}

module.exports = {
    connectQueue,
    sendData
}