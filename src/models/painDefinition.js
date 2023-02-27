const mongoose = require("mongoose");

// Import mongoose to create a new schema for painDefinition
const painDefinitionSchema = new mongoose.Schema({
    // Define the name field with type string, required to be unique, and a required value
    name : {
        type : String,
        required : true,
        unique : true
    },
    // Define the painAreaId field with type ObjectId and reference to PainArea model
    painAreaId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PainArea'
    },
    nameEs : {
        type : String,
        required : true,
        unique : true
    },
    imageUrl : {
        type : String,
        required : true,
    }
});

// Export the painDefinition model
module.exports = mongoose.model("PainDefinition", painDefinitionSchema);