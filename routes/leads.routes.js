const router = require("express").Router();
const { Lead, Project } = require("../models");

/**
 * @route		POST /lead
 * @desc		Insert lead
 * @body	{clientId,projectId,unitId}

 */

router.post("/", async (req, res, next) => {
  if (req.body.projectId && req.body.unitId) {
    const project = await Project.findById(req.body.projectId);
    const alreadyAddedLead = project.leads.includes(req.body.clientId);
    if (alreadyAddedLead) {
      return res
        .status(200)
        .json({ message: "Lead is already added in this project" });
    } else {
      new Lead(req.body)
        .save()
        .then((doc) => {
          res.status(200).json({ data: doc, message: "Lead  Saved" });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    }
  } else if (!req.body.projectId && !req.body.unitId) {
    new Lead(req.body)
      .save()
      .then((doc) => {
        res.status(200).json({ data: doc, message: "Lead Saved" });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  }
});

/**
 * @route		GET /lead
 * @desc		Fetch lead
 */

router.get("/", (req, res, next) => {
  let query = {};
  if ("_id" in req.query) query._id = { $in: req.query._id.split(",") };
  if ("assignedTo" in req.query) query.createdBy = req.query.createdBy;
  if ("intrested" in req.query) query.email = req.query.email;
  if ("phone" in req.query) query.phone = req.query.phone;
  Lead.find(query)
    .populate("createdBy")
    .exec()
    .then((doc) => {
      res.status(200).json({ data: doc });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		PUT /lead/:lead_id
 * @desc		Edit lead records
 */

router.put("/:lead_id", (req, res, next) => {
  if (req.body.projectId && req.body.unitId) {
    const project = await Project.findById(req.body.projectId);
    const alreadyAddedLead = project.leads.includes(req.body.clientId);
    if (alreadyAddedLead) {
      return res
        .status(200)
        .json({ message: "Lead is already added in this project" });
    } else {
      Lead.findByIdAndUpdate(req.params.lead_id, req.body, { new: true })
        .then((doc) => {
          res.status(200).json({ data: doc, message: "Lead Changed" });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    }
  } else if (!req.body.projectId && !req.body.unitId) {
    Lead.findByIdAndUpdate(req.params.lead_id, req.body, { new: true })
      .then((doc) => {
        res.status(200).json({ data: doc, message: "Lead Changed" });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  }
});

/**
 * @route		DELETE /lead/:lead_id
 * @desc		DELETE lead record
 */

router.delete("/:lead_id", (req, res, next) => {
  Lead.findByIdAndDelete(req.params.lead_id)
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Lead  Deleted" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
