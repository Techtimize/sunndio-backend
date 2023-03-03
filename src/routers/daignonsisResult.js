const express = require("express");
const router = express.Router();

// Import the required model files
const Probability = require("../models/probability");
const AssignResult = require("../models/assignResult");
const PainPossibleDiag = require("../models/painPossibleDiagnostics");
const errorMessageEn = require("../Error-Handling/error-handlingEn.json");
const errorMessageEs = require("../Error-Handling/error-handlingEs.json");
const CountryCode = require("../enums/countryCodeEnum");

// Function to retrieve the probability for a given pain behavior ID
const getProbabilityByPainBehaviorId = (request) => {
  // Find the probability based on the painBehaviorId
  const prob = Probability.find({ painBehaviorId: request.painBehaviorId });
  return prob;
};

// Function to retrieve the assign result for a given pain behavior ID and question answer
const getAssignResultByPainBehaviorId = (request, index) => {
  // Find the result based on the painBehaviorId, DiagAnswer and painBehaviorQuestionId
  const result = AssignResult.find(
    {
      painBehaviorId: request.painBehaviorId,
      DiagAnswer: request.questionAnswer[index].isYes,
      painBehaviorQuestionId: request.questionAnswer[index].questionId,
    },
    {
      Percentage: 1,
      possibleDiagnosticId: 1,
    }
  );
  return result;
};

// Function to retrieve the possible diagnoses for a given pain behavior ID
const possibleDiagnosis = (request) => {
  // Find the possible diagnosis based on the painBehaviorId and isPossibleDiag
  const getPainPossibleDiag = PainPossibleDiag.find(
    {
      painBehaviorId: request.painBehaviorId,
      isPossibleDiag: true,
    },
    {
      isPossibleDiag: 0,
      painBehaviorId: 0,
    }
  ).populate("diagnosticsId");
  return getPainPossibleDiag;
};

router.post("/calculateDiagnotics/:countryCode", async (req, res) => {
  const reqCountryCode = req.params.countryCode.toLowerCase();
  try {
    // Get the probability of a condition based on the pain behavior ID
    const getProbability = await getProbabilityByPainBehaviorId(req.body);
    // Store the probability value in a variable
    const probability = getProbability[0].probability;
    // Get the possible diagnoses based on the pain behavior ID
    const populateDiagnosis = await possibleDiagnosis(req.body);

    // Initialize an array to store the results of the assignResult function
    let assignResult = [];
    // Loop through the pain behavior questions
    for (i = 0; i < req.body.questionAnswer.length; i++) {
      // For each question, get the assignResult and add it to the assignResult array
      let data = await getAssignResultByPainBehaviorId(req.body, i);
      assignResult = assignResult.concat(data);
    }
    // Initialize an array to store the result percentages
    let resultPercentage = [];
    // Initialize a variable to keep track of the percentage for each condition
    let per = 0;
    // Loop through the possible diagnoses
    for (i = 0; i < populateDiagnosis.length; i++) {
      // Loop through the assignResult array
      for (j = 0; j < assignResult.length; j++) {
        // If the possibleDiagnosticId in assignResult matches the ID of the current diagnosis, add the percentage to the per variable
        if (
          JSON.stringify(assignResult[j].possibleDiagnosticId) ===
          JSON.stringify(populateDiagnosis[i]._id)
        ) {
          per = per + assignResult[j].Percentage;
        }
      }
      // Round the percentage to the nearest whole number and add it to the resultPercentage array
      let percentage = Math.round(per + probability);
      let diagnosisObj = {};
      per = 0;
      if (reqCountryCode == CountryCode.SPANISH) {
        diagnosisObj = {
          possibleDiagnostic:
            populateDiagnosis[i].diagnosticsId.diagnosisNameEs
              .charAt(0)
              .toUpperCase() +
            populateDiagnosis[i].diagnosticsId.diagnosisNameEs
              .slice(1)
              .toLowerCase(),
          percentage: percentage,
        };
      } else if (
        reqCountryCode == CountryCode.ENGLISH ||
        reqCountryCode == CountryCode.ENGLISH_US
      ) {
        diagnosisObj = {
          possibleDiagnostic:
            populateDiagnosis[i].diagnosticsId.diagnosisName
              .charAt(0)
              .toUpperCase() +
            populateDiagnosis[i].diagnosticsId.diagnosisName
              .slice(1)
              .toLowerCase(),
          percentage: percentage,
        };
      } else {
        // If the country code is not CountryCode.SPANISH or CountryCode.ENGLISH, retrieve the error message for invalid country code
        const errorMessage = errorMessageEs.INVALID_COUNTRY_CODE;
        // Return the error message with a status code of 400 Bad Request
        res.status(errorMessage.statusCode).send({
          success: false,
          message: `${errorMessage.message}: "${reqCountryCode}"`,
        });
      }
      resultPercentage.push(diagnosisObj);
    }
    const errorMessage =
      reqCountryCode === CountryCode.SPANISH
        ? errorMessageEs.QUESTION_BY_PAIN_BEHAVIORS_RETRIEVAL_FAILED
        : reqCountryCode === CountryCode.ENGLISH ||
          reqCountryCode === CountryCode.ENGLISH_US
        ? errorMessageEn.QUESTION_BY_PAIN_BEHAVIORS_RETRIEVAL_FAILED
        : "";
    // Send the resultPercentage array as a response with a status code of 200 (OK)
    !resultPercentage
      ? res.status(errorMessage.statusCode).send(errorMessage.message)
      : res
          .status(errorMessageEn.OK.statusCode)
          .send(
            resultPercentage
              .sort((a, b) => b.percentage - a.percentage)
              .slice(0, 3)
          );
  } catch (err) {
    // If an error occurs, retrieve the error message for failed calculate the diagnosis result
    const errorMessage =
      reqCountryCode === CountryCode.SPANISH
        ? errorMessageEs.INTERNAL_SERVER_ERROR
        : reqCountryCode === CountryCode.ENGLISH ||
          reqCountryCode == CountryCode.ENGLISH_US
        ? errorMessageEn.INTERNAL_SERVER_ERROR
        : "";
    res.status(errorMessage.statusCode).send({
      success: false,
      message: errorMessage.message,
      error: err.message,
    });
  }
});

module.exports = router;
