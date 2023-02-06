const mongoose = require("mongoose");

// Define the mongoose Schema for question
const questionSchema = new mongoose.Schema({
    // Define the question field with type string and a required value
    question : {
        type : String,
        required : true
    }
});

//export the question model
module.exports = mongoose.model("Question", questionSchema);
