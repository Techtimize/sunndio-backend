const express = require("express");
const router = express.Router();
const DiagnosisResult = require("../models/diagnosisResult");
const Probability = require("../models/probability");
const AssignResult = require("../models/assignResult");
const painPossibleDiag = require("../models/painPossibleDiagnostics");
const PainBehaviorQuestion = require("../models/painBehaviorQuestion");
const { ObjectId } = require('mongodb');

const getProbabilityByPainBehaviorId = (request) => {
  const prob = Probability.find({ painBehaviorId: request.painBehaviorId });
  return prob;
}
const getAssignResultByPainBehaviorId = (request, question, index) => {
  const results = AssignResult.find({
    painBehaviorId: request.painBehaviorId,
    DiagAnswer: request.questionAnswer[index].isYes,
    painBehaviorQuestionId: question[index]._id
  }, {
    Percentage: 1,
    possibleDiagnosticId: 1
  });
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
const getPainBehaviorQuestion = (request) => {
  const result = PainBehaviorQuestion.find({ painBehaviorId: request.painBehaviorId }, { _id: 1 });
  return result;
}

router.get("/calculateDiagnotics", async (req, res) => {
  try {
    const getProbability = await getProbabilityByPainBehaviorId(req.body);
    const probability = getProbability[0].probability;

    const populateDiagnosis = await possibleDiagnosis(req.body);
    const dignosis = populateDiagnosis.map((_diagnosis) => _diagnosis.diagnosticsId);

    let result = [];
    const painBehaviorQuestion = await getPainBehaviorQuestion(req.body);
    for (i = 0; i < painBehaviorQuestion.length; i++) {
      let data = await getAssignResultByPainBehaviorId(req.body, painBehaviorQuestion, i);
      result = result.concat(data);
    }
    let resultPercentage = [];
    let per = 0;
    for(i=0; i<populateDiagnosis.length; i++){
      for(j=0; j<result.length; j++){
        if(JSON.stringify(result[j].possibleDiagnosticId) === JSON.stringify(populateDiagnosis[i]._id)){
          per = per+result[j].Percentage;
        }
      }
      let percentage = Math.round(per+probability);
      per = 0;
      let obj ={
        possibleDiagnostic:populateDiagnosis[i].diagnosticsId.diagnosisName,
        Percentage : percentage
      };
      resultPercentage.push(obj);
    }
    //console.log(result.length)
    res.status(200).send(resultPercentage);
  } catch (err) {
    // Respond with a status code of 404 and the error message if there was an issue retrieving the data
    res.status(404).send(err);
  }
});

module.exports = router;
