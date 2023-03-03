const express = require("express");
const router = express.Router();
const question = require("../models/question");
const CountryCode = require("../enums/countryCodeEnum");
const errorMessageEn = require("../Error-Handling/error-handlingEn.json");
const errorMessageEs = require("../Error-Handling/error-handlingEs.json");

// insert questions into the to MonogoDB
router.post("/question", async (req, res) => {
  try {
    const addQuestion = new question(req.body);
    const savedQuestion = await addQuestion.save();
    res.status(201).send(savedQuestion);
  } catch (err) {
    res.status(404).send(err);
  }
});
//get all questions from the MonogoDB
router.get("/questions/:countryCode", async (req, res) => {
  const reqCountryCode = req.params.countryCode.toLowerCase();
  try {
    var getQuestion = await question.find();
    let questionObj = {};
    let questions = [];
    for (i = 0; i < getQuestion.length; i++) {
      if (reqCountryCode === CountryCode.SPANISH) {
        questionObj = {
          _id: getQuestion[i]._id,
          question:
            getQuestion[i].questionEs.charAt(0).toUpperCase() +
            getQuestion[i].questionEs.slice(1).toLowerCase(),
        };
      } else if (
        reqCountryCode === CountryCode.ENGLISH ||
        reqCountryCode === CountryCode.ENGLISH_US
      ) {
        questionObj = {
          _id: getQuestion[i]._id,
          question: getQuestion[i].question.charAt(0).toUpperCase() +
          getQuestion[i].question.slice(1).toLowerCase(),
        };
      } else {
        const errorMessage = errorMessageEn.INVALID_COUNTRY_CODE;
        return res.status(errorMessage.statusCode).json({
          success: `"${reqCountryCode}" ${errorMessage.message}`,
        });
      }
      questions.push(questionObj);
    }
    return res.status(200).send(questions);
  } catch (err) {
    const errorMessage =
      reqCountryCode === CountryCode.SPANISH
        ? errorMessageEs.INTERNAL_SERVER_ERROR
        : reqCountryCode === CountryCode.ENGLISH ||
          reqCountryCode === CountryCode.ENGLISH_US
        ? errorMessageEn.INTERNAL_SERVER_ERROR
        : "";
    return res.status(errorMessage.statusCode).send({
      success: false,
      message: errorMessage.message,
      error: err.message,
    });
  }
});
//get question by Id
router.get("/question/:id", async (req, res) => {
  try {
    const getQuestion = await question.findById(req.params.id);
    !questions ? res.status(404).send() : res.status(200).send(questions);
  } catch (err) {
    res.status(404).send(err);
  }
});
// update question by id
router.patch("/question/:id", async (req, res) => {
  try {
    const updateQuestion = await question.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(updateQuestion);
  } catch (err) {
    res.status(404).send(err);
  }
});
// delete question by id
router.delete("/question/:id", async (req, res) => {
  try {
    const deleteQuestion = await question.findByIdAndDelete(req.params.id);
    !deleteQuestion
      ? res.status(400).send()
      : res.status(200).send(deleteQuestion);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
