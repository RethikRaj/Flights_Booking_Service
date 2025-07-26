const express = require('express');
const { PingController } = require('../../controllers');

const router = express.Router();

router.get('/ping', PingController.ping);

module.exports = router