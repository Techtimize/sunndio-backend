const express = require("express");
const router = express.Router();
const Probability = require("../models/probability");

// insert probability data into the MonogoDB
router.post("/Probability", async (req, res) => {
  try {
    const addProbability = new Probability(req.body);
    const savedProbability = await addData.save();
    res.status(201).send(savedProbability);
  } catch (err) {
    res.status(404).send(err);
  }
});
// get all the probability data from the MonogoDB
router.get("/Probability", async (req, res) => {
  try {
    const getProbability = await Probability.find();
    res.status(200).send(getProbability);
  } catch (err) {
    res.status(404).send(err);
  }
});
// get the probability data by Id
router.get("/Probability/:id", async (req, res) => {
  try {
    const getProbability = await Probability.findById(req.params.id);
    !getProbability
      ? res.status(404).send()
      : res.status(200).send(getProbability);
  } catch (err) {
    res.status(404).send(err);
  }
});
// update the probability data into the MonogoDB by id
router.patch("/Probability/:id", async (req, res) => {
  try {
    const updateProbability = await Probability.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(updateProbability);
  } catch (err) {
    res.status(404).send(err);
  }
});
// delete the probability data from the MonogoDB by id
router.delete("/Probability/:id", async (req, res) => {
  try {
    const deleteProbability = await Probability.findByIdAndDelete(
      req.params.id
    );
    !deleteProbability
      ? res.status(400).send()
      : res.status(200).send(deleteProbability);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
