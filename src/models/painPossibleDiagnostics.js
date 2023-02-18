const mongoose = require("mongoose");

// Define the mongoose Schema for painPossibleDiagnostic, it contained the painBehaviorId, diagnosticsId
const painPossibleDiagnosticSchema = new mongoose.Schema({
    diagnosticsId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Diagnostic"
    },
    painBehaviorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "PainBehavior"
    },
    isPossibleDiag : {
        type : Boolean
    }
});

// export the painPossibleDiagnostic model
module.exports = mongoose.model("PainPossibleDiagnotic", painPossibleDiagnosticSchema);;