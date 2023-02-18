const mongoose = require("mongoose");

// Import mongoose to create a new schema for assignResult
const assignResultSchema = new mongoose.Schema({
    // Define the DiagAnswer field with type Boolean
    DiagAnswer : {
        type : Boolean
    },
    // Define the Percentage field with type Number
    Percentage : {
        type : Number
    },
    // Define the possibleDiagnosticId field with type ObjectId and reference to PainPossibleDiagnostic model
    possibleDiagnosticId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "PainPossibleDiagnotic"
    },
    // Define the painBehaviorId field with type ObjectId and reference to PainBehavior model
    painBehaviorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PainBehavior'
    },
    // Define the painBehaviorQuestionId field with type ObjectId and reference to PainBehaviorQuestion model
    painBehaviorQuestionId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PainBehaviorQuestion'
    }
});

// Export the assignResult model
module.exports = mongoose.model("AssignResult", assignResultSchema);