
const { MongoClient, ServerApiVersion } = require('mongodb'); // check this if needed
const mongoose = require('mongoose');
const express = require('express');
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

const userSchemaObject = {
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true,
        minlength: 8,
    },
    confirmPassword:{
        type:String,
        required: true,
        minlength: 8,
        validate: function(){
            return this.password === this.confirmPassword
        }
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },

}

const userSchema = new mongoose.Schema(userSchemaObject);

const UserModel= mongoose.model("UserModel",userSchema);

console.log(UserModel);

app.use(express.json());

const createUser = async(req,res) =>{
    try{
        console.log(req.body);
        let user = UserModel.create(req.body);

        if(!user){
            res.status(400).json({
                status:"Failure",
                data:user
        });
        }

        res.status(200).json({
            status:"Success",
            data:user
    });
       
    }catch(err){
        res.status(500).json({
            message:"Internal server error"
        });
    }
}

app.use('/api/users',createUser);

const port = 3000;

app.listen(port, ()=>{

    console.log(`server is running at ${port}`);
})
