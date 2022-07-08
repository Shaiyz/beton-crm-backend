const router = require("express").Router();
const { Project } = require("../models");

/**
 * @route		POST /project
 * @desc		Insert project
 */

router.post("/", async (req, res, next) => {
  new Project(req.body)
    .save()
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Project added" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		GET /project
 * @desc		Fetch project records
 */

router.get("/", (req, res, next) => {
  let query = {};
  if ("projectId" in req.query)
    query._id = { $in: req.query.projectId.split(",") };
  if ("name" in req.query) query.name = req.query.name;
  if ("location" in req.query) query.location = req.query.location;

  Project.find(query)
    .then((doc) => {
      res.status(200).json({ data: doc });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		PUT /project/:projectId
 * @desc		Edit project records
 */

router.put("/:projectId", (req, res, next) => {
  Project.findByIdAndUpdate(req.params.projectId, req.body, { new: true })
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Project Changed" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		DELETE /project/:projectId
 * @desc		DELETE project record
 */

router.delete("/:projectId", (req, res, next) => {
  Project.findByIdAndDelete(req.params.projectId)
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Project  Deleted" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
