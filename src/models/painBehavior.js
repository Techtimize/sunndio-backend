const mongoose = require("mongoose");

// Import mongoose to create a new schema for painBehavior
const painBehaviorSchema = new mongoose.Schema({
    // Define the name field with type string, required to be unique, and a required value
    name : {
        type : String,
        required : true,
        unique : true
    },
    // Define the painDefinitionId field with type ObjectId and reference to PainDefinition model
    painDefinitionId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "PainDefinition"
    },
    nameEs : {
        type : String,
        require :true,
        unique : true
    },
    imageUrl : {
        type : String,
        required : true
    }

});

// Export the painBehavior model
module.exports = mongoose.model("PainBehavior", painBehaviorSchema);