const express = require("express");
const router = express.Router();
const painBehaviorModel = require("../models/painBehavior");
const CountryCode = require("../enums/countryCodeEnum");


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
router.get("/painBehaviorsByPainDefinition/:countryCode/:painDefinitionId", async (req, res) => {
  try {
    var foundPainBehaviors;
    // Check the provided country code to return pain behaviors in the appropriate language
    if (req.params.countryCode === CountryCode.SPANISH) {
      foundPainBehaviors = await painBehaviorModel.find(
        { painDefinitionId: req.params.painDefinitionId },
        // Return all fields except for painDefinitionId and name in English
        { painDefinitionId: 0, name: 0 }
      );
    }
    else if (req.params.countryCode === CountryCode.ENGLISH) {
      foundPainBehaviors = await painBehaviorModel.find(
        { painDefinitionId: req.params.painDefinitionId },
        // Return all fields except for painDefinitionId and name in Spanish 
        { painDefinitionId: 0, nameEs: 0 }
      );
    }
    else {
      // If the provided country code is not valid, return an error message
      res.status(400).json({ success: `${req.params.countryCode} this countryCode is not available `});
    }
    // Return the found pain behaviors
    res.status(200).send(foundPainBehaviors);
  } catch (error) {
    // Return a server error if something went wrong while fetching the data
    res.status(500).send(error);
  }
});

// Route to get all pain behaviors from MongoDB
router.get("/painBehaviors/:countryCode", async (req, res) => {
  try {
    var foundPainBehaviors;
    // Check the provided country code to return pain behaviors in the appropriate language
    if (req.params.countryCode === CountryCode.SPANISH) {
      foundPainBehaviors = await painBehaviorModel.find(
        // Return all pain behaviors, except for the name in Spanish
        {}, { name: 0 }
      );
    }
    else if (req.params.countryCode === CountryCode.ENGLISH) {
      foundPainBehaviors = await painBehaviorModel.find(
        // Return all pain behaviors, except for the name in English
        {}, { nameEs: 0 }
      );
    } else {
      // If the provided country code is not valid, return an error message
      res.status(400).json({ success: `${req.params.countryCode} this countryCode is not available `});
    }
    // Return the found pain behaviors
    res.status(200).send(foundPainBehaviors);
  }
  catch (err) {
    // Return a server error if something went wrong while fetching the data
    res.status(404).send(err);
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
