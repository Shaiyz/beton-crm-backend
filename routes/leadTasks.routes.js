const router = require("express").Router();
const { Lead, Transaction, Project } = require("../models");

/**
 * @route		POST /leadTask
 * @desc		Insert task in lead
 * @body {task._id,}
 */

router.post("/:lead", async (req, res, next) => {
  try {
    if (req.body.client) {
      const status =
        req.body.subTaskName == "closedWon"
          ? "sold"
          : req.body.subTaskName == "token"
          ? "token"
          : "partial";
      const transaction = await Transaction.findOne({
        unit: req.body.unit,
      });
      if (transaction) {
        if (
          transaction.client.toString().replace(/ObjectId\("(.*)"\)/, "$1") !==
          req.body.client
        ) {
          throw new Error("Another client has already paid for this unit!");
        }
        if (transaction.status == status) {
          throw new Error("Transaction already created!");
        }
      }

      await Transaction.create({
        client: req.body.client,
        project: req.body.project,
        unit: req.body.unit,
        amount: req.body.amount,
        createdBy: req.body.createdBy,
        status: status,
      });

      await Project.findOneAndUpdate(
        { "unit._id": req.body.unit },
        {
          $set: {
            "unit.$.status": status,
          },
        }
      );
      const doc = await Lead.findOneAndUpdate(
        { _id: req.params.lead },
        { $push: { leadTasks: req.body } }
      );
      return res.status(200).json({ doc: doc, message: "Transaction created" });
    }
    const doc = await Lead.findOneAndUpdate(
      { _id: req.params.lead },
      { $push: { leadTasks: req.body } }
    );
    return res.status(200).json({ doc: doc, message: "Lead Task added." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route		Get /leadTask/:user
 * @desc		get employee tasks
 */
router.get("/:user", (req, res, next) => {
  Lead.find()
    .populate("intrested client leadTasks.task leadTasks.subtask")
    .then((doc) => {
      let userTasks = [];
      doc.map((lead, ind) =>
        lead.leadTasks.map((task) => {
          if (
            task.createdBy.toString().replace(/ObjectId\("(.*)"\)/, "$1") ==
            req.params.user
          ) {
            const { addedBy, leadTasks, assignedTo, _id, ...rest } = lead._doc;
            userTasks.push({ ...rest, leadId: _id, ...task._doc });
          }
        })
      );
      return res
        .status(200)
        .json({ data: userTasks, message: "User task fetched" });
    })
    .catch((error) => {
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
