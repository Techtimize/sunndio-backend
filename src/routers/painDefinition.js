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
    const reqCountryCode = req.params.countryCode.toLowerCase();
    try {
      // Find all pain definitions for a specific pain area
      const getPaindefinition = await paindefinition.find({
        painAreaId: req.params.painAreaId,
      }, {}, { sort: { _id: 1 }});
      var painDefinitions;
      // Check if the request country code is valid
      if (reqCountryCode === CountryCode.SPANISH) {
        painDefinitions = getPaindefinition.map(item =>({
          _id: item._id,
          name: item.nameEs.charAt(0).toUpperCase() +
          item.nameEs.slice(1).toLowerCase(),
          imageUrl: item.imageUrl,
        }));
      } else if (
        reqCountryCode === CountryCode.ENGLISH ||
        reqCountryCode === CountryCode.ENGLISH_US
      ) {
        painDefinitions = getPaindefinition.map(item =>({
          _id: item._id,
          name: item.name.charAt(0).toUpperCase() +
          item.name.slice(1).toLowerCase(),
          imageUrl: item.imageUrl,
        }));
      } else {
        // Return an error if the country code is not valid
        const errorMessage = errorMessageEn.INVALID_COUNTRY_CODE;
        return res.status(errorMessage.statusCode).json({
          success: `"${reqCountryCode}" ${errorMessage.message}`,
        });
      }
      const errorMessage =
        reqCountryCode === CountryCode.SPANISH
          ? errorMessageEs.PAIN_DEFINITIONS_RETRIEVAL_FAILED
          : reqCountryCode === CountryCode.ENGLISH ||
            reqCountryCode === CountryCode.ENGLISH_US
          ? errorMessageEn.PAIN_DEFINITIONS_RETRIEVAL_FAILED
          : "";
      // Check if any live pain areas were found and send a response accordingly
      return !painDefinitions
        ? res.status(errorMessage.statusCode).send(errorMessage.message)
        : res.status(errorMessageEn.OK.statusCode).send(painDefinitions);
    } catch (err) {
      const errorMessage =
        reqCountryCode === CountryCode.SPANISH
          ? errorMessageEs.INTERNAL_SERVER_ERROR
          : reqCountryCode === CountryCode.ENGLISH
          ? errorMessageEn.INTERNAL_SERVER_ERROR
          : "";
      return res.status(errorMessage.statusCode).send({
        success: false,
        message: errorMessage.message,
        error: err.message,
      });
    }
  }
);

// get all the painDefinition data
router.get("/painDefinitions/:countryCode", async (req, res) => {
  const reqCountryCode = req.params.countryCode.toLowerCase();
  try {
    var getPaindefinition;
    // Check if the request country code is valid
    if (reqCountryCode === CountryCode.SPANISH) {
      // Find all pain definitions, excluding the name field in English
      getPaindefinition = await paindefinition.find({}, { name: 0 }, {sort : {_id : 1}});
    } else if (reqCountryCode === CountryCode.ENGLISH) {
      // Find all pain definitions, excluding the nameEs field in Spanish
      getPaindefinition = await paindefinition.find({}, { nameEs: 0 }, {sort : {_id : 1}});
    } else {
      // Return an error if the country code is not valid
      const errorMessage = errorMessageEs.INVALID_COUNTRY_CODE;
      return res.status(errorMessage.statusCode).json({
        success: `"${reqCountryCode}" ${errorMessage.message}`,
      });
    }
    const errorMessage =
      reqCountryCode === CountryCode.SPANISH
        ? errorMessageEs.PAIN_DEFINITIONS_RETRIEVAL_FAILED
        : reqCountryCode === CountryCode.ENGLISH
        ? errorMessageEn.PAIN_DEFINITIONS_RETRIEVAL_FAILED
        : "";
    // Check if any live pain areas were found and send a response accordingly
    return !getPaindefinition
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
