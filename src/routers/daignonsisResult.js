const express = require("express");
const router = express.Router();

// Import the required model files
const Probability = require("../models/probability");
const AssignResult = require("../models/assignResult");
const painPossibleDiag = require("../models/painPossibleDiagnostics");
const PainBehaviorQuestion = require("../models/painBehaviorQuestion");

// Function to retrieve the probability for a given pain behavior ID
const getProbabilityByPainBehaviorId = (request) => {
  // Find the probability based on the painBehaviorId
  const prob = Probability.find({ painBehaviorId: request.painBehaviorId });
  return prob;
}

// Function to retrieve the assign result for a given pain behavior ID and question answer
const getAssignResultByPainBehaviorId = (request, question, index) => {
  // Find the result based on the painBehaviorId, DiagAnswer and painBehaviorQuestionId
  const result = AssignResult.find({
    painBehaviorId: request.painBehaviorId,
    DiagAnswer: request.questionAnswer[index].isYes,
    painBehaviorQuestionId: question[index]._id
  }, {
    Percentage: 1,
    possibleDiagnosticId: 1
  });
  return result;
}

// Function to retrieve the possible diagnoses for a given pain behavior ID
const possibleDiagnosis = (request) => {
  // Find the possible diagnosis based on the painBehaviorId and isPossibleDiag
  const getPainPossibleDiag = painPossibleDiag.find({
    painBehaviorId: request.painBehaviorId,
    isPossibleDiag: true
  }, {
    isPossibleDiag: 0,
    painBehaviorId: 0
  }).populate("diagnosticsId");
  return getPainPossibleDiag;
}

// Function to retrieve the pain behavior questions for a given pain behavior ID
const getPainBehaviorQuestion = (request) => {
  // Find the pain behavior question based on the painBehaviorId
  const result = PainBehaviorQuestion.find({ painBehaviorId: request.painBehaviorId }, { _id: 1 });
  return result;
}

router.get("/calculateDiagnotics", async (req, res) => {
  try {
    // Get the probability of a condition based on the pain behavior ID
    const getProbability = await getProbabilityByPainBehaviorId(req.body);
    // Store the probability value in a variable
    const probability = getProbability[0].probability;

    // Get the possible diagnoses based on the pain behavior ID
    const populateDiagnosis = await possibleDiagnosis(req.body);

    // Initialize an array to store the results of the assignResult function
    let assignResult = [];
    // Get the pain behavior questions based on the pain behavior ID
    const painBehaviorQuestion = await getPainBehaviorQuestion(req.body);
    // Loop through the pain behavior questions
    for (i = 0; i < painBehaviorQuestion.length; i++) {
      // For each question, get the assignResult and add it to the assignResult array
      let data = await getAssignResultByPainBehaviorId(req.body, painBehaviorQuestion, i);
      assignResult = assignResult.concat(data);
    }
    // Initialize an array to store the result percentages
    let resultPercentage = [];
    // Initialize a variable to keep track of the percentage for each condition
    let per = 0;
    // Loop through the possible diagnoses
    for(i=0; i<populateDiagnosis.length; i++){
      // Loop through the assignResult array
      for(j=0; j<assignResult.length; j++){
        // If the possibleDiagnosticId in assignResult matches the ID of the current diagnosis, add the percentage to the per variable
        if(JSON.stringify(assignResult[j].possibleDiagnosticId) === JSON.stringify(populateDiagnosis[i]._id)){
          per = per + assignResult[j].Percentage;
        }
      }
      // Round the percentage to the nearest whole number and add it to the resultPercentage array
      let percentage = Math.round(per + probability);
      per = 0;
      let obj = {
        possibleDiagnostic: populateDiagnosis[i].diagnosticsId.diagnosisName,
        percentage : percentage
      };
      resultPercentage.push(obj);
    }
    // Send the resultPercentage array as a response with a status code of 200 (OK)
    res.status(200).send(resultPercentage);
  } catch (err) {
    // Respond with a status code of 404 and the error message if there was an issue retrieving the data
    res.status(404).send(err);
  }
});

module.exports = router;
