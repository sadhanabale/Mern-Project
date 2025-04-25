const express = require('express');
const { confirmBookingController } = require('../controllers/bookingController');
const { protectRouteMiddleware } = require('../controllers/authController'); // Or wherever you export it from

const router = express.Router();

router.post('/confirm', protectRouteMiddleware, confirmBookingController);

module.exports = router;
