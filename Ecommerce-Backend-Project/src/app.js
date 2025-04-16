
const { MongoClient, ServerApiVersion } = require('mongodb'); // check this if needed
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

const UserModel = require('./models/userModel');
const otpGenerator = require('./utils/otpGenerator');
const otpEmailTemplate = require('./email/dynamicEmailSender');
const sendEmailHelper = require('./email/dynamicEmailSender');

const SECRET_KEY = "ABCD0987";

const dotenv = require('dotenv');

dotenv.config();

const {PRIVATE_KEY,PUBLIC_KEY,WEBHOOK_SECRET} = process.env;

// console.log(SECRET_KEY);

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

app.use('/search',(req,res)=>{
    console.log(req.query);
    res.status(200).json({
        message:"search successful",
        data:req.query
    })
});


const signUpController = async(req, res,next) => {

    const userObj = req.body;
   console.log(userObj);
    try{
        if(userObj){
            let newUser = await UserModel.create(userObj);
    
            res.status(200).json({
                status:"Success",
                message:"User has been created successfuly"
            });
        }
    }catch(error){
      next(error);
    }
  
}
    const payload = {user:"sadhana venkatesh"};

    const loginController = async(req,res,next)=>{
        console.log("loginController called");
        const {email,password} = req.body;

        const user = await UserModel.findOne({email});

        if(!user){
            res.status(404).json({
                status:"failure",
                message:"User not found"
            })
        }

        const isPasswordSame = password===user.password;

        try{
            if(isPasswordSame){
                try {
                        console.log("here we")
                        if (!payload) {
                            return res.status(400).json({ message: "Payload is required" });
                        }

                        jwt.sign({id: user["_id"]}, SECRET_KEY, { algorithm: "HS256" }, (err, token) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({ message: "Error generating token" });
                            }

                            console.log("token",token);

                            res.cookie("jwt", token, {
                                maxAge: 30 * 60 * 1000,
                                httpOnly: true
                            });
                            res.status(200).json({ 
                                status:"success",
                                message: "Signup successful",
                             });
                        });
                    } catch (error) {
                        res.status(500).json({
                            status:"failure",
                             message: "Invalid credentials" });
                    }
            }

         } catch(error) {
            next(error)

        }
    }

    app.get('/logout',(req,res)=>{
        res.clearCookie('token');
        res.status(200).json({
            message:"user logged out successfully"
        })
    });

    const protectRouteMiddleware = (req, res, next) => {
        console.log("protectRouteMiddleware called");
        try {
            const token = req.cookies.jwt; // Use a different variable name to avoid conflict with the jwt module
            if (!token) {
                return res.status(401).json({
                    status: "failure",
                    message: "No token provided"
                });
            }
    
            // Now you can safely use jwt.verify
            const decodedToken = jwt.verify(token, SECRET_KEY);
    
            if (decodedToken) {
                const userId = decodedToken.id;
                req.userId = userId;
                return next(); // Proceed to the next middleware
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


    const getUserProfile = async(req,res)=>{
        console.log("getUserProfile called");
        const id = req.userId;
        const userDetails = await UserModel.findById(id);
        const {name, email} = userDetails;
        res.status(200).json({
            status:"success",
            message:"User Data Retrieved Successfully",
            user:{
                name,
                email
            }
        })
    }

    const forgotPassword = async(req,res,next)=>{
        try{

            const {email} = req.body;
            const user = await UserModel.findOne({email});

            if(!user){
                return res.status(404).json({
                    status:"failure",
                    message:"User not found"
                })
            }

            const otp = otpGenerator();
            console.log("Generated OTP:", otp);


            await sendEmailHelper(otp, user.name,email);

            user.otp = otp;
            user.otpExpiry = Date.now()+ 5*60*1000;

            await user.save();

            return res.status(200).json({
                status:"success",
                message:"otp has been sent successfully to your email",
                otp:otp,
                userId:user.id
            })
        }
        catch(error){
            next(error)
        }
    }

    const resetPassword = async (req, res, next) => {
        try {
          const userId = req.params.userId;
          const { otp, password, confirmPassword } = req.body;
      
          const user = await UserModel.findById(userId);
          if (!user) {
            return res.status(404).json({
              status: "failure",
              message: "User not found",
            });
          }

          console.log("user",user);
      
          console.log("DB OTP:", user.otp);
          console.log("Received OTP:", otp);
      
          if (!otp || otp !== user.otp) {
            return res.status(400).json({
              status: "failure",
              message: "Invalid OTP",
            });
          }
      
          const currentTime = Date.now();
          if (currentTime > user.otpExpiry) {
            return res.status(400).json({
              status: "failure",
              message: "OTP expired",
            });
          }
      
          user.password = password;
          user.confirmPassword = confirmPassword;
          user.otp = undefined;
          user.otpExpiry = undefined;
      
          await user.save();
      
          return res.status(200).json({
            status: "success",
            message: "Password has been updated successfully",
          });
        } catch (error) {
          next(error);
        }
      };

      const isAdminMiddleware = (req,res,next)=>{
            try{

            }catch(error){

            }
      }

      const validUsers = ["user","admin","seller"];

      const isAuthorizedMiddleware = (allowedUser)=>{

        console.log("allowedUser",allowedUser);
        return async(req,res,next)=>{
            try{

                let id = req.userId;

                const user = await UserModel.findById(id);

                console.log("user role",user.role);

                const isAuthorized = allowedUser.includes(user.role);

                if(isAuthorized){
                    next();
                }else{
                    res.status(401).json({
                        status:"failure",
                        message:"You are not authorized user"
                    });
                }

            }catch(error){
                next(error);
            }
        }
  }

      const getAllUsers = async(req, res) => {
        try {
            const users = await UserModel.find();
            res.status(200).json(users);
        } catch (error) {
             res.status(500).json({message: 'Internal Server Error'});
        }
    }
      
    const checkoutController = (req, res) => {
        try {
          let razorpayInstance = new Razorpay({
            key_id: PUBLIC_KEY,
            key_secret: PRIVATE_KEY
          });
      
          let options = {
            amount: 50000,
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
      
            console.log("Created order:", order);
      
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
      }


      const paymentVerificationController = (req,res,next) =>{
        try{
            if(!WEBHOOK_SECRET){
                throw new Error("webhook secret key is not defined")
            }

            const { body,headers} = req;

            console.log(body);
            console.log(headers);

            const freshSignature = crypto.createHmac('sha256',WEBHOOK_SECRET).update(JSON.stringify(body)).digest('hex');
            console.log(freshSignature);
            

            const razorpaySignature = headers['x-razorpay-signature'];

            console.log("razorpaySignature",razorpaySignature);

            if(!razorpaySignature){
                throw new Error('x-razorpa-signature is not being set in the headers');
            }

            if(freshSignature===razorpaySignature){
                res.status(200).json({
                    status: "success",
                    message:"ok"
                })
            }
        }catch(error){
            res.status(500).json({
                status: "failure",
                message:"Internal server error"
            });

        }

      }

    app.post("/login",loginController);
    app.post("/signup", signUpController);
    app.get("/getUser", protectRouteMiddleware, getUserProfile);
    app.patch("/forgotPassword", forgotPassword);
    app.patch("/resetPassword/:userId", resetPassword);
    app.get("/getAllUsers",protectRouteMiddleware,isAuthorizedMiddleware(['admin']), getAllUsers);
    app.post('/checkout', checkoutController)
    app.post('/verification', paymentVerificationController);

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
