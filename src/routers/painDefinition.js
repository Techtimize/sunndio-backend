const express = require("express");
const router = express.Router();
const paindefinition = require("../models/painDefinition");
const errorMessageEn = require("../Error-Handling/error-handlingEn.json");
const errorMessageEs = require("../Error-Handling/error-handlingEs.json");

// insert the painDefinition data in to MonogoDB
router.post("/painDefinition", async (req, res) => {
    try {
        const addPaindefinition = new paindefinition(req.body);
        const savedPaindefinition = await addPaindefinition.save();
        res.status(201).send(savedPaindefinition);
    } catch (err) {
        res.status(400).send(err);
    }
});
// Define the route for retrieving pain definitions based on a pain area ID
router.get("/painDefinitionsByPainAreaId/:countryCode/:painAreaId", async (req, res) => {
    // Check the country code from the request parameters
    if (req.params.countryCode === "es") {
      try {
        // Attempt to retrieve pain definitions for the specified pain area ID, excluding the `painAreaId` and `name` fields
        const getPainDefinition = await paindefinition.find({ painAreaId: req.params.painAreaId }, { painAreaId: 0, name: 0 });
        // Return the pain definitions with a status code of 200 OK
        res.status(200).send(getPainDefinition);
      } catch (err) {
        // If an error occurs, retrieve the error message for failed pain definition retrieval
        const errorMessage = errorMessageEs.PAIN_DEFINITIONS_RETRIEVAL_FAILED;
        // Return the error message with a status code of 404 Not Found
        res.status(errorMessage.statusCode).send({
          success: false,
          message: errorMessage.message,
          error: err.message
        });
      }
    } else if (req.params.countryCode === "en") {
      try {
        // Attempt to retrieve pain definitions for the specified pain area ID, excluding the `painAreaId` and `nameEs` fields
        const getPainDefinition = await paindefinition.find({ painAreaId: req.params.painAreaId }, { painAreaId: 0, nameEs: 0 });
        // Return the pain definitions with a status code of 200 OK
        res.status(200).send(getPainDefinition);
      } catch (err) {
        // If an error occurs, retrieve the error message for failed pain definition retrieval
        const errorMessage = errorMessageEn.PAIN_DEFINITIONS_RETRIEVAL_FAILED;
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
// get all the painDefinition data
router.get("/painDefinitions/:countryCode", async (req, res) => {
    if (req.params.countryCode === "es") {
        try {
            const getPaindefinition = await paindefinition.find({}, { name: 0 });
            res.status(200).send(getPaindefinition);
        } catch (err) {
            res.status(404).send(err);
        }
    }
    else if (req.params.countryCode === "en") {
        try {
            const getPaindefinition = await paindefinition.find({}, { nameEs: 0 });
            res.status(200).send(getPaindefinition);
        } catch (err) {
            res.status(404).send(err);
        }
    }

});
// get the painDefinitions data by painDefinitionId
router.get("/painDefinitions/:id", async (req, res) => {
    try {
        const getPaindefinition = await paindefinition.findById(req.params.id);
        !getPaindefinition ? res.status(404).send() : res.status(200).send(getPaindefinition);
    } catch (err) {
        res.status(404).send(err);
    }
});
// update the painDefiniton data by painDefinitionId
router.patch("/painDefinition/:painDefinitionId", async (req, res) => {
    try {
        const updatePaindefinition = await paindefinition.findByIdAndUpdate(req.params.painDefinitionId, req.body, {
            new: true
        });
        res.status(200).send(updatePaindefinition);
    } catch (err) {
        res.status(404).send(err);
    }
});
// delete the painDefiniton data by painDefinitionId
router.delete("/painDefinition/:painDefinitionId", async (req, res) => {
    try {
        const deletePaindefinition = await paindefinition.findByIdAndDelete(req.params.painDefinitionId);
        !deletePaindefinition ? res.status(400).send() : res.status(200).send(deletePaindefinition);
    } catch (err) {
        res.status(404).send(err);
    }
});

module.exports = router;