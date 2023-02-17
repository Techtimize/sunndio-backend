// Import the necessary modules
const express = require("express");
const router = express.Router();
const painPossibleDiag = require("../models/painPossibleDiagnostics");
const CountryCode = require("../enums/countryCodeEnum");
const errorMessageEn = require("../Error-Handling/error-handlingEn.json");
const errorMessageEs = require("../Error-Handling/error-handlingEs.json");

// Define a function to get the possible diagnosis for a given pain behavior
const possibleDiagnosis = (painBehaviorId) => {
  const getPainPossibleDiag = painPossibleDiag
    .find(
      {
        painBehaviorId: painBehaviorId,
        isPossibleDiag: true,
      },
      {
        isPossibleDiag: 0,
        painBehaviorId: 0,
      }
    )
    .populate("diagnosticsId");
  return getPainPossibleDiag;
};

// Define a route to get the possible diagnoses for a given pain behavior and country code
router.get(
  "/painPossibleDiagBypainBehaviorId/:countryCode/:painBehaviorId",
  async (req, res) => {
  const reqCountryCode = req.params.countryCode.toLowerCase();
    try {
      // Get the possible diagnosis IDs using the possibleDiagnosis function
      const populatDiagnosis = await possibleDiagnosis(
        req.params.painBehaviorId
      );
      // Map the diagnosis IDs to their corresponding documents
      const mappedDiagnosis = populatDiagnosis.map(
        (_diagnosis) => _diagnosis.diagnosticsId
      );
      var diagnosis;
      if (reqCountryCode === CountryCode.SPANISH) {
        // Map the diagnosis documents to the Spanish version of the diagnosis names
        diagnosis = mappedDiagnosis.map((item) => ({
          _id: item._id,
          diagnosisName: item.diagnosisNameEs,
          __v: item.__v,
        }));
      } else if (reqCountryCode === CountryCode.ENGLISH || reqCountryCode === CountryCode.ENGLISH_US) {
        // Map the diagnosis documents to the English version of the diagnosis names
        diagnosis = mappedDiagnosis.map((item) => ({
          _id: item._id,
          diagnosisName: item.diagnosisName,
          __v: item.__v,
        }));
      } else {
        // If the provided country code is not valid, send a 400 error
        const errorMessage = errorMessageEn.INVALID_COUNTRY_CODE;
        res.status(errorMessage.statusCode).json({
          success: `"${reqCountryCode}" ${errorMessage.message}`,
        });
      }
      // Send the diagnosis information
      const errorMessage =
        reqCountryCode === CountryCode.SPANISH
          ? errorMessageEs.PAIN_AREAS_RETRIEVAL_FAILED
          : reqCountryCode === CountryCode.ENGLISH || reqCountryCode === CountryCode.ENGLISH_US
          ? errorMessageEn.PAIN_AREAS_RETRIEVAL_FAILED
          : "";
      !diagnosis
        ? res.status(errorMessage.statusCode).send(errorMessage.message)
        : res.status(errorMessageEn.OK.statusCode).send(diagnosis);
    } catch (err) {
      // If there is an error, send a 500 error with the error message
      const errorMessage =
        reqCountryCode === CountryCode.SPANISH
          ? errorMessageEs.INTERNAL_SERVER_ERROR
          : reqCountryCode === CountryCode.ENGLISH || reqCountryCode === CountryCode.ENGLISH_US
          ? errorMessageEn.INTERNAL_SERVER_ERROR
          : "";
      res.status(errorMessage.statusCode).send({
        success: false,
        message: errorMessage.message,
        error: err.message,
      });
    }
  }
);

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
