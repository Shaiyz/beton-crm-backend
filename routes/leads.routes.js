const router = require("express").Router();
const { Lead, Project } = require("../models");

/**
 * @route		POST /lead
 * @desc		Insert lead
 * @body	{client,intrested,unitId}
 */

router.post("/", async (req, res, next) => {
  if (req.body.intrested) {
    const project = await Project.findById(req.body.intrested).populate(
      "leads"
    );
    const alreadyAddedLead =
      project.leads.length > 0
        ? project.leads.map((i) => {
            const clientId = i.client
              .toString()
              .replace(/ObjectId\("(.*)"\)/, "$1");
            if (clientId === req.body.client) {
              return true;
            } else {
              return false;
            }
          })
        : [false];
    if (alreadyAddedLead.includes(true)) {
      return res
        .status(200)
        .json({ message: "Lead is already added in this project" });
    } else {
      Lead.create(req.body)
        .then((doc) => {
          project.leads.push(doc);
          Project.findByIdAndUpdate(req.body.intrested, project, {
            new: true,
          }).then((project) => {
            res.status(200).json({ data: doc, message: "Lead  Saved" });
          });
        })
        .catch((error) => {
          res.status(500).json({ message: "occured while saving lead" });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    }
  } else if (!req.body.intrested) {
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
    .populate("assignedTo client intrested")
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

router.put("/:lead_id", async (req, res, next) => {
  if (req.body.intrested) {
    const project = await Project.findById(req.body.intrested).populate(
      "leads"
    );
    const alreadyAddedLead = project.leads
      ? project.leads.map((i) => {
          if (i.client === req.body.client) {
            return true;
          } else {
            return false;
          }
        })
      : false;
    if (alreadyAddedLead) {
      return res
        .status(200)
        .json({ message: "Lead is already added in this project" });
    } else {
      Lead.findByIdAndUpdate(req.params.lead_id, req.body, { new: true })
        .then((doc) => {
          project.leads.push(doc._id);
          Project.findByIdAndUpdate(req.body.intrested, project, {
            new: true,
          }).then(() => {
            res.status(200).json({ data: doc, message: "Lead Changed" });
          });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    }
  } else if (!req.body.intrested) {
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

/**
 * @route		GET /lead/mobile?assignedTo=
 * @desc		Fetch lead
 */

router.get("/mobile", (req, res, next) => {
  let query = {};
  if ("_id" in req.query) query._id = { $in: req.query._id.split(",") };
  if ("assignedTo" in req.query) query.createdBy = req.query.createdBy;
  if ("intrested" in req.query) query.email = req.query.email;
  if ("phone" in req.query) query.phone = req.query.phone;
  Lead.find(query)
    .populate("client intrested")
    .exec()
    .then((doc) => {
      var result = doc.reduce((unique, o) => {
        if (!unique.some((obj) => obj.client._id == o.client._id)) {
          unique.push(o);
        }
        return unique;
      }, []);
      result = result.map((i) => {
        return {
          client: i.client,
          intrested: {
            project: i.intrested.name,
            location: i.intrested.location,
          },
        };
      });
      res.status(200).json({
        data: result,
        statusCode: 200,
        message: "Successfully fetched",
      });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: error.message, statusCode: 500, data: [] });
    });
});

module.exports = router;
