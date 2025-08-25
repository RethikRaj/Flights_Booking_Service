const cron = require('node-cron');
const {BookingService} = require('../../services');

function scheduleCrons(){
    // For every 10 mins cancel all old bookings
    cron.schedule('*/10 * * * *', () => {
        BookingService.cancelAllOldBookings();
    });
}

module.exports = scheduleCrons
