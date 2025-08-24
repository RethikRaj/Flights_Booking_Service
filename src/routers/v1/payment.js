const express = require('express');
const { PaymentMiddlewares } = require('../../middlewares');
const { PaymentController } = require('../../controllers');
const router = express.Router();


router.post('/', PaymentMiddlewares.validateMakePayment, PaymentController.makePayment);


module.exports = router;