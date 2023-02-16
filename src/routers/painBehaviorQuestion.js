// Importing express and setting up the router
const express = require("express");
const router = express.Router();

// Importing the painBehaviorQuestion model and the CountryCode enum
const painBehaviorQuestion = require("../models/painBehaviorQuestion");
const CountryCode = require("../enums/countryCodeEnum");
const errorMessageEn = require("../Error-Handling/error-handlingEn.json");
const errorMessageEs = require("../Error-Handling/error-handlingEs.json");

// Route to get questions by pain behavior ID and country code
router.get("/questionsByPainBehavior/:countryCode/:painBehaviorId", async (req, res) => {
  try {
    // Query the painBehaviorQuestion model for all question IDs associated with the specified pain behavior ID
    // and populate the actual question document for each ID
    const questionIDs = await painBehaviorQuestion.find({
      painBehaviorId: req.params.painBehaviorId,
    }, {
      painBehaviorId: 0,
      _id: 0,
    }).populate("questionId");
    // Extract the populated question documents from the query result
    const mappedQuestions = questionIDs.map((_question) => _question.questionId);
    var question;
    if (req.params.countryCode === CountryCode.SPANISH) {
      // Map the questions to a new array with only the Spanish version of the question
      question = mappedQuestions.map(item => ({
        _id: item._id,
        questionEs: item.questionEs,
        __v: item.__v
      }));
    }
    else if (req.params.countryCode === CountryCode.ENGLISH) {
      // Map the questions to a new array with only the English version of the question
      question = mappedQuestions.map(item => ({
        _id: item._id,
        question: item.question,
        __v: item.__v
      }));
    } else {
      // If an invalid country code is specified, return an error response
      res.status(400).json({ success: `${req.params.countryCode} this countryCode is not available ` });
    }
    // Return the resulting array of questions
    res.status(200).send(question);
  } catch (err) {
    // If an error occurs, return a 404 error response
    res.status(404).send(err);
  }
});

// Export the router for use in the main application
module.exports = router;



