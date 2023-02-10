const express = require("express");
const router = express.Router();
const painBehaviorQuestion = require("../models/painBehaviorQuestion");

// get the question form the MongoDB by painBehaviorId
router.get("/questionsByPainBehavior/:countryCode/:painBehaviorId", async (req, res) => {
  if (req.params.countryCode === "es") {
    try {
      // get the questionsIDs from the bridge using papulate method 
      const questionIDs = await painBehaviorQuestion
        .find(
          {
            painBehaviorId: req.params.painBehaviorId,
          },
          {
            painBehaviorId: 0,
            _id: 0,
          }
        )
        .populate("questionId");
      // get the questions using map mathod from the papulated array
      const questions = questionIDs.map((_question) => _question.questionId);
      const questionEs = questions.map(item => ({
        _id: item._id,
        questionEs: item.questionEs,
        __v: item.__v
      }));
      res.status(200).send(questionEs);
    } catch (err) {
      res.status(404).send(err);
    }
  }
  else if (req.params.countryCode === "en") {
    try {
      // get the questionsIDs from the bridge using papulate method 
      const questionIDs = await painBehaviorQuestion
        .find(
          {
            painBehaviorId: req.params.painBehaviorId,
          },
          {
            painBehaviorId: 0,
            _id: 0,
          }
        )
        .populate("questionId");
      // get the questions using map mathod from the papulated array
      const questions = questionIDs.map((_question) => _question.questionId);
      const questionEn = questions.map(item => ({
        _id: item._id,
        question: item.question,
        __v: item.__v
      }));
      res.status(200).send(questionEn);
    } catch (err) {
      res.status(404).send(err);
    }
  }
  else{
    res.status(400).json({ success: `"${req.params.countryCode}" this countryCode is not available` });
  }
});

module.exports = router;
