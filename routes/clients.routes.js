const router = require("express").Router();
const { Client } = require("../models");

/**
 * @route		POST /client
 * @desc		Insert client service records
 * @body		{ charges, merchant_user }
 */

router.post("/", (req, res, next) => {
  new Client(req.body)
    .save()
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Client  Saved" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		GET /client
 * @desc		Fetch client service records
 */

router.get("/", (req, res, next) => {
  let query = {};
  if ("_id" in req.query) query._id = { $in: req.query._id.split(",") };
  if ("createdBy" in req.query) query.createdBy = req.query.createdBy;
  if ("email" in req.query) query.email = req.query.email;
  if ("phone" in req.query) query.phone = req.query.phone;

  Client.find(query)
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
 * @route		PUT /client/:client_id
 * @desc		Edit client records
 */

router.put("/:client_id", (req, res, next) => {
  Client.findByIdAndUpdate(req.params.client_id, req.body, { new: true })
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Client Changed" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		DELETE /client/:client_id
 * @desc		DELETE client record
 */

router.delete("/:client_id", (req, res, next) => {
  Client.findByIdAndDelete(req.params.client_id)
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Client  Deleted" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
