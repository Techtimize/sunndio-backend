const mongoose = require("mongoose");

// Import mongoose to create a new schema
const painAreaSchema = new mongoose.Schema({
    // Define the name field with type string, required to be unique, and a required value
    name : {
        type : String,
        required : true,
        unique : true
    },
    // Define the isLive field with type Boolean
    isLive : {
        type : Boolean
    },
    nameEs : {
        type : String,
        required : true,
        unique : true
    }
});

// Export the painArea model
module.exports = mongoose.model("PainArea", painAreaSchema);