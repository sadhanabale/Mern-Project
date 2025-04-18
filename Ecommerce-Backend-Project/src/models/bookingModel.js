const mongoose = require('mongoose');

const bookingSchemaRules = {

    bookedAt:{
        type: Date,
        default: Date.now(),
    },

    PriceAtThatTime:{
        type:Number,
        required: true
    },

    status:{
        type:String,
        required:true,
        default:"pending",
        enum:["pending","failed","success","confirmed"]
    },

    orderId:{
        type:String

    }

}

const bookingSchema = new mongoose.Schema(bookingSchemaRules);

const BookingModel = new mongoose.model('BookingModel', bookingSchema);

module.exports = BookingModel;