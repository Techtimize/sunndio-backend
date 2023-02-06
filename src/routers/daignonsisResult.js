const express = require("express");
const router = express.Router();
const DiagnosisResult = require("../models/diagnosisResult");
const Probability = require("../models/probability");
const AssignResult = require("../models/assignResult");
const painPossibleDiag = require("../models/painPossibleDiagnostics");
const { ObjectId } = require('mongodb');

const getProbabilityByPainBehaviorId = (request) => {
  const prob = Probability.find({ painBehaviorId: request.painBehaviorId });
  return prob;
}
const getAssignResultByPainBehaviorId = (request) => {
  const results = AssignResult.find({
    painBehaviorId: request.painBehaviorId
  },{
    __v : 0,
    painBehaviorId : 0
  }).populate("painBehaviorQuestionId");
  return results;
}
const possibleDiagnosis = (request) => {
  const getPainPossibleDiag = painPossibleDiag.find({
    painBehaviorId: request.painBehaviorId,
    isPossibleDiag: true
  }, {
    isPossibleDiag: 0,
    painBehaviorId: 0
  }).populate("diagnosticsId");
  return getPainPossibleDiag;
}


router.get("/calculateDiagnotics", async (req, res) => {
  try {
    const getProbability = await getProbabilityByPainBehaviorId(req.body);
    const probability = getProbability[0].probability;
    console.log(probability);

    const populateDiagnosis = await possibleDiagnosis(req.body);
    const dignosis = populateDiagnosis.map((_diagnosis) => _diagnosis.diagnosticsId);

    const assignResult = await getAssignResultByPainBehaviorId(req.body);

    const result = assignResult.filter(element => element.painBehaviorQuestionId && element.DiagAnswer)
  .map(element => {
    if (element.painBehaviorQuestionId.questionId === new ObjectId(req.body.questionAnswer.questionId) &&
      element.DiagAnswer === req.body.questionAnswer.isYes) {
      return element;
    }
  });
    console.log(result.length);
    console.log(result);
    console.log(new ObjectId(req.body.questionAnswer[0].questionId));
    console.log(req.body.questionAnswer[0].isYes);
    console.log(assignResult[0].painBehaviorQuestionId.questionId);
    console.log(assignResult[0].Percentage);

    res.status(200).send(assignResult);
  } catch (err) {
    // Respond with a status code of 404 and the error message if there was an issue retrieving the data
    res.status(404).send(err);
  }
});

module.exports = router;
