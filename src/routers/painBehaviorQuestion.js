// Importing express and setting up the router
const express = require("express");
const router = express.Router();

// Importing the painBehaviorQuestion model and the CountryCode enum
const painBehaviorQuestion = require("../models/painBehaviorQuestion");
const CountryCode = require("../enums/countryCodeEnum");
const errorMessageEn = require("../Error-Handling/error-handlingEn.json");
const errorMessageEs = require("../Error-Handling/error-handlingEs.json");

// Route to get questions by pain behavior ID and country code
router.get(
  "/questionsByPainBehavior/:countryCode/:painBehaviorId",
  async (req, res) => {
    const reqCountryCode = req.params.countryCode.toLowerCase();
    try {
      // Query the painBehaviorQuestion model for all question IDs associated with the specified pain behavior ID
      // and populate the actual question document for each ID
      const questionIDs = await painBehaviorQuestion
        .find(
          {
            painBehaviorId: req.params.painBehaviorId,
          },
          {
            painBehaviorId: 0,
          },
          {
            sort: { _id: 1 }
          }
        )
        .populate("questionId");
      // Extract the populated question documents from the query result
      //const mappedQuestions = questionIDs.map((_question) => _question.questionId);
      var question;
      if (reqCountryCode === CountryCode.SPANISH) {
        // Map the questions to a new array with only the Spanish version of the question
        question = questionIDs.map((item) => ({
          _id: item._id,
          question:
            item.questionId.questionEs,
          gifUrl: item.gifUrl,
        }));
      } else if (
        reqCountryCode === CountryCode.ENGLISH ||
        reqCountryCode === CountryCode.ENGLISH_US
      ) {
        // Map the questions to a new array with only the English version of the question
        question = questionIDs.map((item) => ({
          _id: item._id,
          question:
            item.questionId.question.charAt(0).toUpperCase() +
            item.questionId.question.slice(1).toLowerCase(),
          gifUrl: item.gifUrl,
        }));
      } else {
        // If an invalid country code is specified, return an error response
        const errorMessage = errorMessageEn.INVALID_COUNTRY_CODE;
        res.status(errorMessage.statusCode).json({
          success: `"${reqCountryCode}" ${errorMessage.message}`,
        });
      }
      // Return the resulting array of questions
      const errorMessage =
        reqCountryCode === CountryCode.SPANISH
          ? errorMessageEs.QUESTION_BY_PAIN_BEHAVIORS_RETRIEVAL_FAILED
          : reqCountryCode === CountryCode.ENGLISH ||
            reqCountryCode === CountryCode.ENGLISH_US
            ? errorMessageEn.QUESTION_BY_PAIN_BEHAVIORS_RETRIEVAL_FAILED
            : "";
      // Check if any questions were found and send a response accordingly
      !question
        ? res.status(errorMessage.statusCode).send(errorMessage.message)
        : res.status(errorMessageEn.OK.statusCode).send(question);
    } catch (err) {
      // If an error occurs, return a error response
      const errorMessage =
        reqCountryCode === CountryCode.SPANISH
          ? errorMessageEs.INTERNAL_SERVER_ERROR
          : reqCountryCode === CountryCode.ENGLISH ||
            reqCountryCode === CountryCode.ENGLISH_US
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

// Export the router for use in the main application
module.exports = router;
