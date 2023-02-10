const express = require("express");
const router = express.Router();
const painBehaviorQuestion = require("../models/painBehaviorQuestion");
const errorMessageEn = require("../Error-Handling/error-handlingEn.json");
const errorMessageEs = require("../Error-Handling/error-handlingEs.json");

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
      // If an error occurs, retrieve the error message for failed questions by pain behavior id retrieval
      const errorMessage = errorMessageEs.QUESTION_BY_PAIN_BEHAVIORS_RETRIEVAL_FAILED;
      // Return the error message with a status code of 404 Not Found
      res.status(errorMessage.statusCode).send({
        success: false,
        message: errorMessage.message,
        error: err.message
      });
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
      // If an error occurs, retrieve the error message for failed questions by pain behavior id retrieval
      const errorMessage = errorMessageEn.QUESTION_BY_PAIN_BEHAVIORS_RETRIEVAL_FAILED;
      // Return the error message with a status code of 404 Not Found
      res.status(errorMessage.statusCode).send({
        success: false,
        message: errorMessage.message,
        error: err.message
      });
    }
  }
  else {
    // If the country code is not "es" or "en", retrieve the error message for invalid country code
    const errorMessage = errorMessageEs.INVALID_COUNTRY_CODE;
    // Return the error message with a status code of 400 Bad Request
    res.status(errorMessage.statusCode).send({
      success: false,
      message: `${errorMessage.message}: "${req.params.countryCode}"`
    });
  }
});

module.exports = router;
