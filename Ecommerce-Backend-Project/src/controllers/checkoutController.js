const Razorpay = require('razorpay');
const shortid = require('shortid');
const crypto = require('crypto');

// Renamed the environment variables as per your request
const { PRIVATE_KEY, PUBLIC_KEY, WEBHOOK_SECRET } = process.env;

const checkoutController = (req, res) => {
  try {
    let razorpayInstance = new Razorpay({
      key_id: PUBLIC_KEY,
      key_secret: PRIVATE_KEY
    });

    let options = {
      amount: 50000, // 50000 paise = 500 INR
      currency: "INR",
      receipt: shortid.generate(),
      payment_capture: 1
    };

    razorpayInstance.orders.create(options, function (err, order) {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        return res.status(500).json({
          status: "failure",
          message: "Error creating Razorpay order"
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Order created successfully",
        order: order
      });
    });

  } catch (error) {
    console.error("Exception in checkoutController:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error"
    });
  }
};

const paymentVerificationController = (req, res, next) => {
  try {
    if (!WEBHOOK_SECRET) {
      throw new Error("Webhook secret key is not defined");
    }

    const { body, headers } = req;
    const freshSignature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(JSON.stringify(body)).digest('hex');
    const razorpaySignature = headers['x-razorpay-signature'];
    

    console.log("freshSignature",freshSignature);
    console.log("razorpaySignature",razorpaySignature);

    if (!razorpaySignature) {
      throw new Error('x-razorpay-signature is not being set in the headers');
    }

    if (freshSignature === razorpaySignature) {
      res.status(200).json({
        status: "success",
        message: "Verification successful"
      });
    } else {
      res.status(400).json({
        status: "failure",
        message: "Invalid signature"
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Internal server error"
    });
  }
};

module.exports = {
  checkoutController,
  paymentVerificationController
};
