const express = require("express");
const router = express.Router();
const PainArea = require("../models/painArea");
const errorMessageEn = require("../Error-Handling/error-handlingEn.json");
const errorMessageEs = require("../Error-Handling/error-handlingEs.json");

// Route to create a new pain area
router.post("/painarea", async (req, res) => {
  try {
    // create new PainArea object
    const newPainArea = new PainArea(req.body);
    // save the new pain area to the database
    const savedPainArea = await newPainArea.save();
    // return the saved pain area
    res.status(201).send(savedPainArea);
  } catch (err) {
    res.status(404).send(err);
  }
});

// Define the route for retrieving live pain areas
router.get("/painareas/:countryCode", async (req, res) => {
  // Check the country code from the request parameters
  if (req.params.countryCode === "es") {
    try {
      // Attempt to retrieve live pain areas, excluding the `name` field
      const livePainAreas = await PainArea.find({ isLive: true }, { name: 0 });
      // Return the live pain areas with a status code of 200 OK
      res.status(200).send(livePainAreas);
    } catch (err) {
      // If an error occurs, retrieve the error message for failed pain area retrieval
      const errorMessage = errorMessageEs.PAIN_AREAS_RETRIEVAL_FAILED;
      // Return the error message with a status code of 404 Not Found
      res.status(errorMessage.statusCode).send({
        success: false,
        message: errorMessage.message,
        error: err.message
      });
    }
  } else if (req.params.countryCode === "en") {
    try {
      // Attempt to retrieve live pain areas, excluding the `nameEs` field
      const livePainAreas = await PainArea.find({ isLive: true }, { nameEs: 0 });
      // Return the live pain areas with a status code of 200 OK
      res.status(200).send(livePainAreas);
    } catch (err) {
      // If an error occurs, retrieve the error message for failed pain area retrieval
      const errorMessage = errorMessageEn.PAIN_AREAS_RETRIEVAL_FAILED;
      // Return the error message with a status code of 404 Not Found
      res.status(errorMessage.statusCode).send({
        success: false,
        message: errorMessage.message,
        error: err.message
      });
    }
  } else {
    // If the country code is not "es" or "en", retrieve the error message for invalid country code
    const errorMessage = errorMessageEs.INVALID_COUNTRY_CODE;
    // Return the error message with a status code of 400 Bad Request
    res.status(errorMessage.statusCode).send({
      success: false,
      message: `${errorMessage.message}: "${req.params.countryCode}"`
    });
  }
});

// Route to get a pain area by id
router.get("/painarea/:countryCode/:painAreaId", async (req, res) => {
  if (req.params.countryCode === "es") {
    try {
      // get the id from the request parameters and find the pain area by id
      const painArea = await PainArea.findById(req.params.painAreaId, { name: 0 });
      // if the pain area is not found, return a 404 error
      !painArea ? res.status(404).send() : res.status(200).send(painArea);
    } catch (err) {
      res.status(404).send(err);
    }
  }
  else if (req.params.countryCode === "en") {
    try {
      // get the id from the request parameters and find the pain area by id
      const painArea = await PainArea.findById(req.params.painAreaId, { nameEs: 0 });
      // if the pain area is not found, return a 404 error
      !painArea ? res.status(404).send() : res.status(200).send(painArea);
    } catch (err) {
      res.status(404).send(err);
    }
  }
});

// Route to update a pain area by id
router.patch("/painarea/:painAreaId", async (req, res) => {
  try {
    // get the id from the request parameters
    const painAreaId = req.params.painAreaId;
    // find and update the pain area by id with the new data
    const updatedPainArea = await PainArea.findByIdAndUpdate(
      painAreaId,
      req.body,
      {
        new: true,
      }
    );
    // return the updated pain area
    res.status(200).send(updatedPainArea);
  } catch (err) {
    res.status(404).send(err);
  }
});

// Route to delete a pain area by id
router.delete("/painarea/:painAreaId", async (req, res) => {
  try {
    // find and delete the pain area by id
    const deletedPainArea = await PainArea.findByIdAndDelete(
      req.params.painAreaId
    );
    // if the pain area is not found, return a 400 error
    !deletedPainArea
      ? res.status(400).send()
      : res.status(200).send(deletedPainArea);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
