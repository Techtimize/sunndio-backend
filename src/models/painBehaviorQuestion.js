const mongoose = require("mongoose");

// Define the mongoose Schema for painBehaviorQuestion, it contained only the painBehaviorId, and questionId
const painBehaviorQuestionSchema = mongoose.Schema({
    painBehaviorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PainBehavior'
    },
    questionId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Question'
    },
    gifUrl : {
        type : String,
        required : true
    }
});

// export the painBehaviorQuestion model
module.exports = mongoose.model('PainBehaviorQuestion', painBehaviorQuestionSchema);
