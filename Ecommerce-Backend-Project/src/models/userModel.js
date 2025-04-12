const mongoose = require('mongoose');

const userSchemaObj = {
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true 
    },

    password:{
        type: String,
        required: true,
        minlength: 8
    },

    confirmPassword: {
        type: String,
        required: true,
        minlength: 8,
        validate: function(){
            return this.password === this.confirmPassword
        }
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    otp:{
        type: String
    },

    otpExpiry:{
        type:Date
    },

    role:{
        type:String,
        default:"user"
    }

};


const userSchema = new mongoose.Schema(userSchemaObj);

const UserModel = mongoose.model("UserModel",userSchema);

module.exports = UserModel;