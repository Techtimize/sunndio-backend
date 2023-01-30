const mongoose = require("mongoose");

// Define the mongoose Schema for painBehaviorQuestion, it contained only the painBehaviorId, and questionId
const painBehaviorQuesiton = mongoose.Schema({
    painBehavior_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PainBehavior'
    },
    question_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'question'
    }
});

// export the painBehaviorQuesiton model
module.exports = mongoose.model('PainBehaviorQuestion', painBehaviorQuesiton);