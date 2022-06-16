const router = require("express").Router();
const { Lead } = require("../models");

/**
 * @route		POST /leadTask
 * @desc		Insert task in lead
 * @body {task._id,}
 */

router.post("/:lead", async (req, res, next) => {
  try {
    const doc = await Lead.findOneAndUpdate(
      { _id: req.params.lead },
      { $push: { leadTasks: req.body } }
    );
    return res.status(200).json({ doc: doc, message: "Lead Task added." });
  } catch (err) {
    res.status(500).json({ message: "Couldn't add lead task." });
  }
});

/**
 * @route		PUT /leadTask/:currenTaskId
 * @desc		Edit task records
 */
router.put("/:currenTaskId", (req, res, next) => {
  Lead.findOne({ "leadTasks._id": req.params.currenTaskId })
    .then((doc) => {
      const task = doc.leadTasks.id(req.params.currenTaskId);
      task.set(req.body);
      return doc.save();
    })
    .then((lead) => {
      return res.status(200).json({ data: lead, message: "Lead task Updated" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
