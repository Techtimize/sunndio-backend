const express = require("express");
const router = express.Router();
const painPossibleDiag = require("../models/painPossibleDiagnostics");

const possibleDiagnosis = (painBehaviorId) => {
  const getPainPossibleDiag = painPossibleDiag.find({
    painBehaviorId: painBehaviorId,
    isPossibleDiag: true
  }, {
    isPossibleDiag: 0,
    painBehaviorId: 0
  }).populate("diagnosticsId");
  return getPainPossibleDiag;
}

router.get("/painPossibleDiagBypainBehaviorId/:countryCode/:painBehaviorId", async (req, res) => {
  if (req.params.countryCode === "es") {
    try {
      const populatDiagnosis = await possibleDiagnosis(req.params.painBehaviorId);

      const dignosis = populatDiagnosis.map((_diagnosis) => _diagnosis.diagnosticsId);
      const diagnosisEs = dignosis.map(item => ({
        _id: item._id,
        diagnosisNameEs: item.diagnosisNameEs,
        __v: item.__v
      }));
      res.status(200).send(diagnosisEs);
    } catch (err) {
      res.status(404).send(err);
    }
  }
  else if (req.params.countryCode === "en") {
    try {
      const populatDiagnosis = await possibleDiagnosis(req.params.painBehaviorId);

      const dignosis = populatDiagnosis.map((_diagnosis) => _diagnosis.diagnosticsId);
      const diagnosisEs = dignosis.map(item => ({
        _id: item._id,
        diagnosisName: item.diagnosisName,
        __v: item.__v
      }));
      res.status(200).send(diagnosisEs);
    } catch (err) {
      res.status(404).send(err);
    }
  }
  else{
    res.status(400).json({ success: `"${req.params.countryCode}" this countryCode is not available` });
  }
}
);
router.get("/painPossibleDiag", async (req, res) => {
  try {
    const getPainPossibleDiag = await painPossibleDiag.find();
    res.status(200).send(getPainPossibleDiag);
  } catch (err) {
    res.status(404).send(err);
  }
});
router.get("/painPossibleDiag/:id", async (req, res) => {
  try {
    const getPainPossibleDiag = await painPossibleDiag.findById(req.params.id);
    !getPainPossibleDiag
      ? res.status(404).send()
      : res.status(200).send(getPainPossibleDiag);
  } catch (err) {
    res.status(404).send(err);
  }
});
router.patch("/painPossibleDiag/:id", async (req, res) => {
  try {
    const updatePainPossibleDiag = await painPossibleDiag.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(updatePainPossibleDiag);
  } catch (err) {
    res.status(404).send(err);
  }
});
router.delete("/painPossibleDiag/:id", async (req, res) => {
  try {
    const deletePainPossibleDiag = await painPossibleDiag.findByIdAndDelete(
      req.params.id
    );
    !deletePainPossibleDiag
      ? res.status(400).send()
      : res.status(200).send(deletePainPossibleDiag);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
