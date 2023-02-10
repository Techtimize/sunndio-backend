const express = require("express");
const router = express.Router();
const painBehaviorModel = require("../models/painBehavior");
const errorMessageEn = require("../Error-Handling/error-handlingEn.json");
const errorMessageEs = require("../Error-Handling/error-handlingEs.json");

// Route to insert pain behavior data into MongoDB
router.post("/painbehavior", async (req, res) => {
  try {
    // Creating a new pain behavior instance using the request body
    const newPainBehavior = new painBehaviorModel(req.body);
    // Saving the new pain behavior instance to the database
    const savedPainBehavior = await newPainBehavior.save();
    // Sending a 201 (Created) status and the saved pain behavior data as response
    res.status(201).send(savedPainBehavior);
  } catch (error) {
    // Sending a 404 (Not Found) status and the error message as response
    res.status(404).send(error);
  }
});

// Route to get pain behaviors by pain definition id
router.get(
  "/painBehaviorsByPainDefinition/:countryCode/:painDefinitionId",
  async (req, res) => {
    if (req.params.countryCode === "es") {
      try {
        // Finding the pain behaviors by pain definition id
        const foundPainBehaviors = await painBehaviorModel.find(
          { painDefinitionId: req.params.painDefinitionId },
          { painDefinitionId: 0, name: 0 }
        );
        // Sending a 200 (OK) status and the found pain behaviors data as response
        res.status(200).send(foundPainBehaviors);
      } catch (err) {
        // If an error occurs, retrieve the error message for failed pain behavior retrieval
        const errorMessage = errorMessageEs.PAIN_BEHAVIORS_RETRIEVAL_FAILED;
        // Return the error message with a status code of 404 Not Found
        res.status(errorMessage.statusCode).send({
          success: false,
          message: errorMessage.message,
          error: err.message
        });
      }
    }
    else if (req.params.countryCode === "en") {
      try {
        // Finding the pain behaviors by pain definition id
        const foundPainBehaviors = await painBehaviorModel.find(
          { painDefinitionId: req.params.painDefinitionId },
          { painDefinitionId: 0, nameEs: 0 }
        );
        // Sending a 200 (OK) status and the found pain behaviors data as response
        res.status(200).send(foundPainBehaviors);
      } catch (err) {
        // If an error occurs, retrieve the error message for failed pain behavior retrieval
        const errorMessage = errorMessageEn.PAIN_BEHAVIORS_RETRIEVAL_FAILED;
        // Return the error message with a status code of 404 Not Found
        res.status(errorMessage.statusCode).send({
          success: false,
          message: errorMessage.message,
          error: err.message
        });
      }
    }
    else {
      // If the country code is not "es" or "en", retrieve the error message for invalid country code
      const errorMessage = errorMessageEs.INVALID_COUNTRY_CODE;
      // Return the error message with a status code of 400 Bad Request
      res.status(errorMessage.statusCode).send({
        success: false,
        message: `${errorMessage.message}: "${req.params.countryCode}"`
      });
    }
  });

// Route to get all pain behaviors from MongoDB
router.get("/painBehaviors/:countryCode", async (req, res) => {
  if (req.params.countryCode === "es") {
    try {
      // Finding all the pain behaviors in the database
      const foundPainBehaviors = await painBehaviorModel.find({}, { name: 0 });
      // Sending a 200 (OK) status and the found pain behaviors data as response
      res.status(200).send(foundPainBehaviors);
    } catch (error) {
      // Sending a 404 (Not Found) status and the error message as response
      res.status(404).send(error);
    }
  }
  else if (req.params.countryCode === "en") {
    try {
      // Finding all the pain behaviors in the database
      const foundPainBehaviors = await painBehaviorModel.find({}, { nameEs: 0 });
      // Sending a 200 (OK) status and the found pain behaviors data as response
      res.status(200).send(foundPainBehaviors);
    } catch (error) {
      // Sending a 404 (Not Found) status and the error message as response
      res.status(404).send(error);
    }
  }
  else {
    res.status(400).json({ success: `"${req.params.countryCode}" this countryCode is not available` });
  }
});

// Route to get a single pain behavior by id from MongoDB
router.get("/painbehavior/:painBehaviorId", async (req, res) => {
  try {
    // Finding the pain behavior by id
    const foundPainBehavior = await painBehaviorModel.findById(
      req.params.painBehaviorId
    );
    // If no pain behavior is found, sending a 400 (Bad Request) status
    if (!foundPainBehavior) {
      res.status(400).send();
    } else {
      // Sending a 200 (OK) status and the found pain behavior data as response
      res.status(200).send(foundPainBehavior);
    }
  } catch (error) {
    // Sending a 404 (Not Found) status and the error message as response
    res.status(404).send(error);
  }
});
//Update a pain behavior by id in the MongoDB
router.patch("/painbehavior/:painBehaviorId", async (req, res) => {
  try {
    const updatedPainBehavior = await PainBehavior.findByIdAndUpdate(
      req.params.painBehaviorId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(updatedPainBehavior);
  } catch (error) {
    res.status(404).send(error);
  }
});

//Delete a pain behavior by id from the MongoDB
router.delete("/painbehavior/:painBehaviorId", async (req, res) => {
  try {
    const deletedPainBehavior = await PainBehavior.findByIdAndDelete(
      req.params.painBehaviorId
    );
    if (!deletedPainBehavior) {
      res.status(400).send();
    } else {
      res.status(200).send(deletedPainBehavior);
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
