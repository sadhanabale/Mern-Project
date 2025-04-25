// src/controllers/authController.js

const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel'); 
const SECRET_KEY = "ABCD0987";

// protectRouteMiddleware: Verifies if the user is authenticated via JWT token
const protectRouteMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        status: "failure",
        message: "No token provided"
      });
    }

    const decodedToken = jwt.verify(token, SECRET_KEY);

    if (decodedToken) {
      req.userId = decodedToken.id;
      return next();
    } else {
      return res.status(401).json({
        status: "failure",
        message: "Invalid or expired token"
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: "Error verifying token"
    });
  }
};

// isAuthorizedMiddleware: Verifies if the user has an authorized role to access a route
const isAuthorizedMiddleware = (allowedUser) => {
  return async (req, res, next) => {
    try {
      let id = req.userId;
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({
          status: "failure",
          message: "User not found"
        });
      }

      const isAuthorized = allowedUser.includes(user.role);

      if (isAuthorized) {
        next();
      } else {
        res.status(401).json({
          status: "failure",
          message: "You are not authorized to access this resource"
        });
      }
    } catch (error) {
      next(error);
    }
  };
};

// signUpController, loginController, forgotPassword, resetPassword (existing functions)
const signUpController = async (req, res, next) => {
  const userObj = req.body;
  try {
    if (userObj) {
      let newUser = await UserModel.create(userObj);

      res.status(200).json({
        status: "Success",
        message: "User has been created successfully"
      });
    }
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    res.status(404).json({
      status: "failure",
      message: "User not found"
    });
  }

  const isPasswordSame = password === user.password;

  try {
    if (isPasswordSame) {
      try {
        if (!user) {
          return res.status(400).json({ message: "Payload is required" });
        }

        jwt.sign({ id: user["_id"] }, SECRET_KEY, { algorithm: "HS256" }, (err, token) => {
          if (err) {
            return res.status(500).json({ message: "Error generating token" });
          }

          res.cookie("jwt", token, {
            maxAge: 30 * 60 * 1000,
            httpOnly: true
          });
          res.status(200).json({
            status: "success",
            message: "Login successful"
          });
        });
      } catch (error) {
        res.status(500).json({
          status: "failure",
          message: "Invalid credentials"
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "failure",
        message: "User not found"
      });
    }

    const otp = otpGenerator();

    await sendEmailHelper(otp, user.name, email);

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "OTP has been sent successfully to your email",
      otp: otp,
      userId: user.id
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { otp, password, confirmPassword } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "failure",
        message: "User not found"
      });
    }

    if (!otp || otp !== user.otp) {
      return res.status(400).json({
        status: "failure",
        message: "Invalid OTP"
      });
    }

    const currentTime = Date.now();
    if (currentTime > user.otpExpiry) {
      return res.status(400).json({
        status: "failure",
        message: "OTP expired"
      });
    }

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password has been updated successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Exporting all the middleware and controller functions
module.exports = {
  protectRouteMiddleware,
  isAuthorizedMiddleware,
  signUpController,
  loginController,
  forgotPassword,
  resetPassword
};
