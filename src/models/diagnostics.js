const mongoose = require("mongoose");

// Define the mongoose Schema for diagnostic
const diagnosticSchema = new mongoose.Schema({
    diagnosisName : {
        type : String,
        required : true,
        unique : true
    }
});

// export the diagnosticSchema model
module.exports = mongoose.model("Diagnostic", diagnosticSchema);
