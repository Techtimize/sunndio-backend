const express = require("express");
const router = express.Router();
const PainArea = require("../models/painArea");
const CountryCode = require("../enums/countryCodeEnum");
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

// Route to get all live pain areas by country code
router.get("/painareas/:countryCode", async (req, res) => {
  const reqCountryCode = req.params.countryCode.toLowerCase();
  try {
    // Find all pain areas where isLive is true
    const livePainAreas = await PainArea.find({ isLive: true });
    let painAreaObj = {};
    let painAreas = [];
    // Check if the country code is Spanish
    for (i = 0; i < livePainAreas.length; i++) {
      if (reqCountryCode === CountryCode.SPANISH) {
        painAreaObj = {
          _id: livePainAreas[i]._id,
          name: livePainAreas[i].nameEs,
        };
      }
      // Check if the country code is English
      else if (
        reqCountryCode === CountryCode.ENGLISH ||
        reqCountryCode === CountryCode.ENGLISH_US
      ) {
        painAreaObj = {
          _id: livePainAreas[i]._id,
          name: livePainAreas[i].name,
        };
      }
      // If the country code is not recognized, return an error response
      else {
        const errorMessage = errorMessageEn.INVALID_COUNTRY_CODE;
        return res.status(errorMessage.statusCode).json({
          success: `"${reqCountryCode}" ${errorMessage.message}`,
        });
      }
      painAreas.push(painAreaObj);
    }
    const errorMessage =
      reqCountryCode === CountryCode.SPANISH
        ? errorMessageEs.PAIN_AREAS_RETRIEVAL_FAILED
        : reqCountryCode === CountryCode.ENGLISH ||
          reqCountryCode === CountryCode.ENGLISH_US
        ? errorMessageEn.PAIN_AREAS_RETRIEVAL_FAILED
        : "";
    // Check if any live pain areas were found and send a response accordingly
    return !painAreas
      ? res.status(errorMessage.statusCode).send(errorMessage.message)
      : res.status(errorMessageEn.OK.statusCode).send(painAreas);
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

// Route to get a pain area by ID and country code
router.get("/painarea/:countryCode/:painAreaId", async (req, res) => {
  const reqCountryCode = req.params.countryCode.toLowerCase();
  console.log(reqCountryCode);
  try {
    // Find the pain area by ID
    const painArea = await PainArea.findById(req.params.painAreaId);
    console.log(painArea);
    let painAreaObj = {};
    let painAreas = [];
    // Check if the country code is Spanish
    if (reqCountryCode === CountryCode.SPANISH) {
      painAreaObj = {
        _id: painArea._id,
        name: painArea.nameEs,
      };
    }
    // Check if the country code is English
    else if (
      reqCountryCode === CountryCode.ENGLISH ||
      reqCountryCode === CountryCode.ENGLISH_US
    ) {
      painAreaObj = {
        _id: painArea._id,
        name: painArea.name,
      };
    }
    // If the country code is not recognized, return an error response
    else {
      const errorMessage = errorMessageEn.INVALID_COUNTRY_CODE;
      res.status(errorMessage.statusCode).json({
        success: `"${reqCountryCode}" ${errorMessage.message}`,
      });
    }
    painAreas.push(painAreaObj);
    // Check if the pain area was found and send a response accordingly
    const errorMessage =
      reqCountryCode === CountryCode.SPANISH
        ? errorMessageEs.PAIN_AREAS_RETRIEVAL_FAILED
        : reqCountryCode === CountryCode.ENGLISH ||
          reqCountryCode === CountryCode.ENGLISH_US
        ? errorMessageEn.PAIN_AREAS_RETRIEVAL_FAILED
        : "";
    // Check if any live pain areas were found and send a response accordingly
    !painAreas
      ? res.status(errorMessage.statusCode).send(errorMessage.message)
      : res.status(errorMessageEn.OK.statusCode).send(painAreas);
  } catch (err) {
    // If an error occurs, send a 500 response with the error message
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
