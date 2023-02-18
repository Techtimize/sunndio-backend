const mongoose = require("mongoose");

// Define the mongoose Schema for probability, it contained the painBehaviorId
const probabilitySchema = new mongoose.Schema({
    possible: {
        type : Number,
    },
    probability : {
        type : Number
    },
    total : {
        type : Number
    },
    painBehaviorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "PainBehavior"
    }
});

//
module.exports = mongoose.model("Probability", probabilitySchema);
