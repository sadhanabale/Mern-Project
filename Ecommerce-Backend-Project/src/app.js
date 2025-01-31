
const { MongoClient, ServerApiVersion } = require('mongodb'); // check this if needed
const mongoose = require('mongoose');
const express = require('express');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require ('./routes/productRoutes');

// const dotenv = require('dotenv');

// dotenv.config();

// const {PORT, DB_USER, DB_PASSWORD} = process.env;

const DB_USER = "ashwin_db";
const DB_PASSWORD = "ygli3axrxF8nvC0G";
const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.psoci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const app = express();

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

app.use((err,res,)=> {
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
