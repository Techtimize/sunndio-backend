const mongoose = require("mongoose");

// Define the Mongoose schema for DiagnosisResult, which contains a reference to the painBehavior and painPossibleDiagnostic models.
const diagResultSchema = mongoose.Schema({
  // Store the id of a painPossibleDiagnostic document
  possibleDiagnosticId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "PainPossibleDiagnotic"
  },
  // Store the id of a painBehavior document
  painBehaviorId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'PainBehavior'
  },
  // Store the diagnosis percentage
  DiagPercentage : {
    type : Number
  }
});

// Export the DiagnosisResult model
module.exports = mongoose.model("DiagnosisResult", diagResultSchema);
