const express = require("express");
const router = express.Router();
const DiagnosisResult = require("../models/diagnosisResult");


// Get all diagnosis results
router.get("/diagnosisResult", async (req, res) => {
  try {
    // Retrieve all diagnosis results from the database
    const allDiagnosisResults = await DiagnosisResult.find();
    // Respond with a status code of 200 and the retrieved data
    res.status(200).send(allDiagnosisResults);
  } catch (err) {
    // Respond with a status code of 404 and the error message if there was an issue retrieving the data
    res.status(404).send(err);
  }
});

module.exports = router;
