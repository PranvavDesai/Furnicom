// models/mongodb.js
const mongoose = require("mongoose");

// Create the login schema
const LoginSchema = new mongoose.Schema({
    name: {type: String,required: true},
    email: { type: String,required: true},
    password: {type: String,required: true}
});

// Create and export the Login model
const LogInCollection = mongoose.model("LoginCollection", LoginSchema);
module.exports = LogInCollection;
