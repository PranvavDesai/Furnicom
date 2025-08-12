const mongoose = require('mongoose');
const LoginCollection = require('../models/mongodb.js');

let cartSchema = new mongoose.Schema({
    userId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LogInCollection',
        required: true 
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Furniture',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

// Export the Cart model
module.exports = Cart;