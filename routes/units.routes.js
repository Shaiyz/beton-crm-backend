const router = require("express").Router();
const { Project } = require("../models");

/**
 * @route		GET /unit
 * @desc		get unit
 */

router.get("/", async (req, res, next) => {
  try {
    const doc = await Project.find();
    let units = [];
    doc.forEach((project) =>
      project.unit.map((unit) => units.push({ unit: unit, project: project }))
    );
    return res.status(200).json({ data: units, message: "Unit added." });
  } catch (err) {
    res.status(500).json({ message: "Couldn't add unit." });
  }
});

/**
 * @route		POST /unit
 * @desc		Insert unit
 */

router.post("/:project", async (req, res, next) => {
  try {
    const doc = await Project.findOneAndUpdate(
      { _id: req.params.project },
      { $push: { units: req.body } }
    );
    return res.status(200).json({ doc: doc, message: "Unit added." });
  } catch (err) {
    res.status(500).json({ message: "Couldn't add unit." });
  }
});

/**
 * @route		PUT /unit/:unitId
 * @desc		Edit unit records
 */

router.put("/:unitId", (req, res, next) => {
  Project.findOne({ "units._id": req.params.unitId })
    .then((doc) => {
      const unit = doc.units.id(addressId);
      unit.set(req.body);
      return doc.save();
    })
    .then((project) => {
      return res.status(200).json({ data: project, message: "Unit Updated" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
