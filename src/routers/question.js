const express = require("express");
const router = express.Router();
const question = require("../models/question");
const CountryCode = require("../enums/countryCodeEnum");


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
  try {
    var getQuestion;
    if (req.params.countryCode === CountryCode.SPANISH) {
      getQuestion = await question.find({}, { question: 0 });
    } else if (req.params.countryCode === CountryCode.ENGLISH) {
      getQuestion = await question.find({}, { questionEs: 0 });
    }
    else {
      const errorMessage = errorMessageEs.INVALID_COUNTRY_CODE;
      res
        .status(errorMessage.statusCode)
        .json({
          success: `"${req.params.countryCode}" ${errorMessage.message}`,
        });
    }
    res.status(200).send(getQuestion);
  }
  catch (err) {
    const errorMessage =
      req.params.countryCode === "es"
        ? errorMessageEs.INTERNAL_SERVER_ERROR
        : req.params.countryCode === "en"
        ? errorMessageEn.INTERNAL_SERVER_ERROR
        : "";
    res.status(errorMessage.statusCode).send({
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
    !getQuestion ? res.status(404).send() : res.status(200).send(getQuestion);
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
