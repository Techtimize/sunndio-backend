// Import the necessary modules
const express = require("express");
const router = express.Router();
const painPossibleDiag = require("../models/painPossibleDiagnostics");
const CountryCode = require("../enums/countryCodeEnum");

// Define a function to get the possible diagnosis for a given pain behavior
const possibleDiagnosis = (painBehaviorId) => {
  const getPainPossibleDiag = painPossibleDiag.find({
    painBehaviorId: painBehaviorId,
    isPossibleDiag: true
  }, {
    isPossibleDiag: 0,
    painBehaviorId: 0
  }).populate("diagnosticsId");
  return getPainPossibleDiag;
}

// Define a route to get the possible diagnoses for a given pain behavior and country code
router.get("/painPossibleDiagBypainBehaviorId/:countryCode/:painBehaviorId", async (req, res) => {
  try {
    // Get the possible diagnosis IDs using the possibleDiagnosis function
    const populatDiagnosis = await possibleDiagnosis(req.params.painBehaviorId);
    // Map the diagnosis IDs to their corresponding documents
    const mappedDiagnosis = populatDiagnosis.map((_diagnosis) => _diagnosis.diagnosticsId);
    var diagnosis;
    if (req.params.countryCode === CountryCode.SPANISH) {
      // Map the diagnosis documents to the Spanish version of the diagnosis names
      diagnosis = mappedDiagnosis.map(item => ({
        _id: item._id,
        diagnosisNameEs: item.diagnosisNameEs,
        __v: item.__v
      }));
    } else if (req.params.countryCode === CountryCode.ENGLISH) {
      // Map the diagnosis documents to the English version of the diagnosis names
      diagnosis = mappedDiagnosis.map(item => ({
        _id: item._id,
        diagnosisName: item.diagnosisName,
        __v: item.__v
      }));
    } else {
      // If the provided country code is not valid, send a 400 error
      res.status(400).json({ success: `\"${req.params.countryCode}\" this countryCode is not available` });
    }
    // Send the diagnosis information
    res.status(200).send(diagnosis);
  } catch (err) {
    // If there is an error, send a 500 error with the error message
    res.status(500).send(err);
  }
});

router.get("/painPossibleDiag", async (req, res) => {
  try {
    const getPainPossibleDiag = await painPossibleDiag.find();
    res.status(200).send(getPainPossibleDiag);
  } catch (err) {
    res.status(404).send(err);
  }
});
router.get("/painPossibleDiag/:id", async (req, res) => {
  try {
    const getPainPossibleDiag = await painPossibleDiag.findById(req.params.id);
    !getPainPossibleDiag
      ? res.status(404).send()
      : res.status(200).send(getPainPossibleDiag);
  } catch (err) {
    res.status(404).send(err);
  }
});
router.patch("/painPossibleDiag/:id", async (req, res) => {
  try {
    const updatePainPossibleDiag = await painPossibleDiag.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(updatePainPossibleDiag);
  } catch (err) {
    res.status(404).send(err);
  }
});
router.delete("/painPossibleDiag/:id", async (req, res) => {
  try {
    const deletePainPossibleDiag = await painPossibleDiag.findByIdAndDelete(
      req.params.id
    );
    !deletePainPossibleDiag
      ? res.status(400).send()
      : res.status(200).send(deletePainPossibleDiag);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
