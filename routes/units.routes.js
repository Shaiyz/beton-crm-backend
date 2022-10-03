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
    doc.forEach((project) => {
      project.unit.map((unit) => {
        if (unit.isDeleted == false) {
          units.push({ unit: unit, project: project });
        }
      });
    });
    return res.status(200).json({ data: units, message: "Unit fetched" });
  } catch (err) {
    res.status(500).json({ message: "Couldn't fetch units." });
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
      { $push: { unit: req.body } },
      {
        new: true,
      }
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
  Project.findOne({ "unit._id": req.params.unitId })
    .then((doc) => {
      const unit = doc.unit.id(req.params.unitId);
      unit.set(req.body);
      console.log(unit);
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
