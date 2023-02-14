const express = require("express");
const router = express.Router();
const painBehaviorQuestion = require("../models/painBehaviorQuestion");
const CountryCode = require("../enums/countryCodeEnum");


// get the question form the MongoDB by painBehaviorId
router.get("/questionsByPainBehavior/:countryCode/:painBehaviorId", async (req, res) => {
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
    if (req.params.countryCode === CountryCode.SPANISH) {
      const questionEs = questions.map(item => ({
        _id: item._id,
        questionEs: item.questionEs,
        __v: item.__v
      }));
      res.status(200).send(questionEs);
    }
    else if (req.params.countryCode === CountryCode.ENGLISH) {
      const questionEn = questions.map(item => ({
        _id: item._id,
        question: item.question,
        __v: item.__v
      }));
      res.status(200).send(questionEn);
    } else {
      res.status(400).json({ success: `"${req.params.countryCode}" this countryCode is not available` });
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
