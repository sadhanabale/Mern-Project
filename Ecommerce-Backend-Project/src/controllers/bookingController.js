const BookingModel = require('../models/bookingModel');

 const confirmBookingController = async (req, res) => {
        try {
          const { productId, PriceAtThatTime, orderId } = req.body;
      
          if (!productId || !PriceAtThatTime) {
            return res.status(400).json({
              status: "failure",
              message: "Missing productId or PriceAtThatTime",
            });
          }
      
          const booking = await BookingModel.create({
            product: productId,
            PriceAtThatTime,
            status: "success", // must match enum
            orderId,
          });
      
          res.status(200).json({
            status: "success",
            message: "Booking confirmed",
            booking,
          });
        } catch (err) {
          console.error("Error in confirmBookingController:", err);
          res.status(500).json({
            status: "failure",
            message: "Error confirming booking",
          });
        }
      };

      module.exports = { confirmBookingController };