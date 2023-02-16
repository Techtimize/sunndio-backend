const express = require("express");
const router = express.Router();
const paindefinition = require("../models/painDefinition");
const errorMessageEn = require("../Error-Handling/error-handlingEn.json");
const errorMessageEs = require("../Error-Handling/error-handlingEs.json");
const CountryCode = require("../enums/countryCodeEnum");

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
router.get(
  "/painDefinitionsByPainAreaId/:countryCode/:painAreaId",
  async (req, res) => {
    try {
      var getPaindefinition;
      // Check if the request country code is valid
      if (req.params.countryCode === CountryCode.SPANISH) {
        // Find all pain definitions for a specific pain area, excluding the pain area id and name fields
        getPaindefinition = await paindefinition.find(
          { painAreaId: req.params.painAreaId },
          { painAreaId: 0, name: 0 }
        );
      } else if (req.params.countryCode === CountryCode.ENGLISH) {
        // Find all pain definitions for a specific pain area, excluding the pain area id and Spanish name fields
        getPaindefinition = await paindefinition.find(
          { painAreaId: req.params.painAreaId },
          { painAreaId: 0, nameEs: 0 }
        );
      } else {
        // Return an error if the country code is not valid
        const errorMessage = errorMessageEs.INVALID_COUNTRY_CODE;
        res.status(errorMessage.statusCode).json({
          success: `"${req.params.countryCode}" ${errorMessage.message}`,
        });
      }
      const errorMessage =
        req.params.countryCode === "es"
          ? errorMessageEs.PAIN_DEFINITIONS_RETRIEVAL_FAILED
          : req.params.countryCode === "en"
          ? errorMessageEn.PAIN_DEFINITIONS_RETRIEVAL_FAILED
          : "";
      // Check if any live pain areas were found and send a response accordingly
      !getPaindefinition
        ? res.status(errorMessage.statusCode).send(errorMessage.message)
        : res.status(errorMessageEn.OK.statusCode).send(getPaindefinition);
    } catch (err) {
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
  }
);

// get all the painDefinition data
router.get("/painDefinitions/:countryCode", async (req, res) => {
  try {
    var getPaindefinition;
    // Check if the request country code is valid
    if (req.params.countryCode === CountryCode.SPANISH) {
      // Find all pain definitions, excluding the name field in English
      getPaindefinition = await paindefinition.find({}, { name: 0 });
    } else if (req.params.countryCode === CountryCode.ENGLISH) {
      // Find all pain definitions, excluding the nameEs field in Spanish
      getPaindefinition = await paindefinition.find({}, { nameEs: 0 });
    } else {
      // Return an error if the country code is not valid
      const errorMessage = errorMessageEs.INVALID_COUNTRY_CODE;
        res.status(errorMessage.statusCode).json({
          success: `"${req.params.countryCode}" ${errorMessage.message}`,
        });
    }
    const errorMessage =
        req.params.countryCode === "es"
          ? errorMessageEs.PAIN_DEFINITIONS_RETRIEVAL_FAILED
          : req.params.countryCode === "en"
          ? errorMessageEn.PAIN_DEFINITIONS_RETRIEVAL_FAILED
          : "";
      // Check if any live pain areas were found and send a response accordingly
      !getPaindefinition
        ? res.status(errorMessage.statusCode).send(errorMessage.message)
        : res.status(errorMessageEn.OK.statusCode).send(getPaindefinition);
  } catch (err) {
    res.status(500).send(err);
  }
});
// get the painDefinitions data by painDefinitionId
router.get("/painDefinitions/:id", async (req, res) => {
  try {
    const getPaindefinition = await paindefinition.findById(req.params.id);
    !getPaindefinition
      ? res.status(404).send()
      : res.status(200).send(getPaindefinition);
  } catch (err) {
    res.status(404).send(err);
  }
});
// update the painDefiniton data by painDefinitionId
router.patch("/painDefinition/:painDefinitionId", async (req, res) => {
  try {
    const updatePaindefinition = await paindefinition.findByIdAndUpdate(
      req.params.painDefinitionId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(updatePaindefinition);
  } catch (err) {
    res.status(404).send(err);
  }
});
// delete the painDefiniton data by painDefinitionId
router.delete("/painDefinition/:painDefinitionId", async (req, res) => {
  try {
    const deletePaindefinition = await paindefinition.findByIdAndDelete(
      req.params.painDefinitionId
    );
    !deletePaindefinition
      ? res.status(400).send()
      : res.status(200).send(deletePaindefinition);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
