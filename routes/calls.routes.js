const router = require("express").Router();
const { Call } = require("../models");
const moment = require("moment");

/**
 * @route		POST /call
 * @desc		Insert call records
 */

router.post("/", (req, res, next) => {
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

router.get("/:user/:startDate/:endDate", (req, res, next) => {
  const startDate = moment(new Date(req.params.startDate)).hours(-5);

  let end = req.params.endDate.split("-");
  let endDay = +end[2] + 1;
  end = `${end[0]}-${end[1]}-${endDay}`;
  const endDate = new Date(end);
  Call.find({
    from: req.params.user,
    timestamp: {
      $gte: startDate,
      $lt: endDate,
    },
  })
    .populate("to from")
    .sort({ createdAt: -1 })
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
