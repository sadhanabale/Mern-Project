
const { MongoClient, ServerApiVersion } = require('mongodb'); // check this if needed
const mongoose = require('mongoose');
const express = require('express');
// const CookieParser = require("cookieparser");

const jwt = require('jsonwebtoken');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require ('./routes/productRoutes');

const UserModel = require('./models/userModel');

const SECRET_KEY = "ABCD0987";

// const dotenv = require('dotenv');

// dotenv.config();

// const {PORT, DB_USER, DB_PASSWORD} = process.env;

console.log(SECRET_KEY);

const DB_USER = "ashwin_db";
const DB_PASSWORD = "ygli3axrxF8nvC0G";
const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.psoci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const app = express();

// app.use(CookieParser());

mongoose.connect(dbURL).then((connection)=>{
     console.log('db is connected');
});

app.use(express.json());

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

    // console.log("m in")
  
}
    const payload = {user:"sadhana venkatesh"};

    const loginController = async(req,res,next)=>{
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

                            console.log(token);

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
    app.post("/login",loginController);


    app.post("/signup", signUpController);
    
    
app.use((err,res)=> {

    console.log("here")
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
