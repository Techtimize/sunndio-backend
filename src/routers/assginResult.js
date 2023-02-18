const express = require("express");
const router = express.Router();
const AssignResult = require("../models/assignResult");
const csvtojson = require("csvtojson");


// function to read the data from the CSV file or Excel and insert into the MongoDB
router.post("/importAssignResult", async (req, res) => {
  csvtojson()
    .fromFile("2.3.csv")
    .then((csvData) => {
      console.log(csvData);
      AssignResult.insertMany(csvData)
        .then(function () {
          console.log("Data Inserted");
          res.json({ success: "success" });
        })
        .catch(function (err) {
          console.log(err);
        });
    });
});

// Adds a new assignResult document to the database.
router.post("/assignResult", async (req, res) => {
  try {
    const addAssignResult = new AssignResult(req.body);
    const result = await addAssignResult.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(404).send(err);
  }
});
// Retrieves all assignResult documents from the database.
router.get("/assignResult", async (req, res) => {
  try {
    const getAssignResult = await AssignResult.find();
    res.status(200).send(getAssignResult);
  } catch (err) {
    res.status(404).send(err);
  }
});
// Retrieves a specific assignResult document by its ID
router.get("/assignResult/:assignResultId", async (req, res) => {
  try {
    const getAssignResult = await AssignResult.findById(req.params.assignResultId);
    !getAssignResult ? res.status(404).send() : res.status(200).send(getAssignResult);
  } catch (err) {
    res.status(404).send(err);
  }
});
// Updates an assignResult document by its ID.
router.patch("/AssignResult/:assignResultId", async (req, res) => {
  try {
    const updateAssignResult = await AssignResult.findByIdAndUpdate(req.params.assignResultId, req.body, {
      new: true,
    });
    res.status(200).send(updateAssignResult);
  } catch (err) {
    res.status(404).send(err);
  }
});
// Deletes an assignResult document by its ID.
router.delete("/AssignResult/:assignResultId", async (req, res) => {
  try {
    const deleteAssignResult = await AssignResult.findByIdAndDelete(
      req.params.assignResultId
    );
    !deleteAssignResult ? res.status(400).send() : res.status(200).send(deleteAssignResult);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
