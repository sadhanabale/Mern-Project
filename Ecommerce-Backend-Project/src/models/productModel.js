const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Product title is required'],
        unique: [false, "Product title is unique"],
        maxlength: [100, 'Product name should be less than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        validate: {
            validator: function(){
                return this.price > 0
            },
            message: "Price of the product should be greater than 0"
        }

    },
    category:{
        type: String,
        required: true
    },

    description: {
        type: String,
        required:[true, "Please prvide the decription"],
        maxlength: [400, 'Product description should be less than 400 characters']

    },

    image: {
        type: String,
        required: true
    },

    discount:{
       type: Number,
       validate: {
           validator: function(){
            return this.discount < this.price
           },
           message: "Discount price should be less than the product price"
       }
    },

    stock:{
        type: Number,
        required: [false, "Please provide the stock"],
        validate:{
            validator: function(){
                return this.stock >= 0
            },
            message: "Stock should be greater than 0"
        }
    },
    // rating: {
    //     rate: {
    //         type: Number,
    //         required: true
    //     },
    //     count: {
    //         type: Number,
    //         required: true
    //     }
    // },
    rating: {
        type: {
            rate: { type: Number, required: true },
            count: { type: Number, required: true }
        },
        required: true
    },
    
    // createdAt: {
    //     type: Date,
    //     default: Date.now()
    // }
});

const productModel = new mongoose.model('productModel', productSchema);

module.exports = productModel;