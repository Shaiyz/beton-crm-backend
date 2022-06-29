const router = require("express").Router();
const { Lead } = require("../models");

/**
 * @route		POST /leadTask
 * @desc		Insert task in lead
 * @body {task._id,}
 */

router.post("/:lead", async (req, res, next) => {
  try {
    console.log(req.body);
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
 * @route		Get /leadTask/:user
 * @desc		get employee tasks
 */
router.get("/:user", (req, res, next) => {
  Lead.find(
    { "leadTasks.createdBy": req.params.user },
    { "leadTasks.completed": false }
  )
    .populate("intrested client leadTasks.task leadTasks.subtask")
    .then((doc) => {
      let userTasks = [];
      doc.map((lead, ind) =>
        lead.leadTasks.map((task) => {
          if (task.createdBy == req.params.user) {
            const { addedBy, leadTasks, assignedTo, ...rest } = lead._doc;
            userTasks.push({ ...rest, ...task._doc });
          }
        })
      );
      return res
        .status(200)
        .json({ data: userTasks, message: "Employee task fetched" });
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    });
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
