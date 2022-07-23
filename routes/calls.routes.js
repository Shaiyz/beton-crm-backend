const router = require("express").Router();
const { Call } = require("../models");

/**
 * @route		POST /call
 * @desc		Insert call records
 * @body		{ charges, merchant_user }
 */

router.post("/", (req, res, next) => {
  console.log(req.body);
  Call.create(req.body)
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Call  Saved" });
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		GET /call
 * @desc		Fetch call records
 */

router.get("/", (req, res, next) => {
  let query = {};
  if ("_id" in req.query) query._id = { $in: req.query._id.split(",") };
  if ("createdBy" in req.query) query.createdBy = req.query.createdBy;
  if ("email" in req.query) query.email = req.query.email;
  if ("phone" in req.query) query.phone = req.query.phone;

  Call.find(query)
    .exec()
    .then((doc) => {
      res.status(200).json({ data: doc });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		PUT /call/:call_id
 * @desc		Edit call records
 */

router.put("/:call_id", (req, res, next) => {
  Call.findByIdAndUpdate(req.params.call_id, req.body, { new: true })
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Call Changed" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		DELETE /call/:call_id
 * @desc		DELETE call record
 */

router.delete("/:call_id", (req, res, next) => {
  Call.findByIdAndDelete(req.params.call_id)
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Call  Deleted" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
