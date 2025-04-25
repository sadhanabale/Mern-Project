
const { MongoClient, ServerApiVersion } = require('mongodb'); 
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const shortid = require('shortid');
const crypto = require('crypto');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require ('./routes/productRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const UserModel = require('./models/userModel');
const otpGenerator = require('./utils/otpGenerator');
const otpEmailTemplate = require('./email/dynamicEmailSender');
const sendEmailHelper = require('./email/dynamicEmailSender');


const SECRET_KEY = "ABCD0987";

const dotenv = require('dotenv');
const BookingModel = require('./models/bookingModel');
const { getProductById } = require('./controllers/productController');
const { getAllUsers } = require('./controllers/userController');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const checkoutController = require('./controllers/checkoutController');


dotenv.config();

const {PRIVATE_KEY,PUBLIC_KEY,WEBHOOK_SECRET} = process.env;

const DB_USER = "ashwin_db";
const DB_PASSWORD = "ygli3axrxF8nvC0G";
const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.psoci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const app = express();

app.use(cookieParser());


mongoose.connect(dbURL).then((connection)=>{
     console.log('db is connected');
});

app.use(express.json());
app.use(cors());

app.use('/api/users',userRoutes);
app.use('/api/products',productRoutes);
app.use('/api/bookings', bookingRoutes);

app.use('/search',(req,res)=>{
    res.status(200).json({
        message:"search successful",
        data:req.query
    })
});

      const validUsers = ["user","admin","seller"];
    

    app.post("/login", authController.loginController);
    app.post("/signup", authController.signUpController);
    app.patch("/forgotPassword", authController.forgotPassword);
    app.patch("/resetPassword/:userId", authController.resetPassword);
    app.get("/getUser", authController.protectRouteMiddleware, userController.getUserProfile); 
    app.get("/admin/dashboard", authController.protectRouteMiddleware, authController.isAuthorizedMiddleware(['admin']),getAllUsers);
    app.post('/checkout', checkoutController.checkoutController);
    app.post('/verification', express.raw({ type: 'application/json' }), checkoutController.paymentVerificationController);

    app.use((err,res)=> {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({
        status:statusCode,
        message: message
    });
    });
   
const port = 3000;

app.listen(port, ()=>{

    console.log(`server is running at ${port}`);
})
