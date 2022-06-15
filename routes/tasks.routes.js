const router = require("express").Router();
const { Task } = require("../models");

/**
 * @route		POST /task
 * @desc		Insert task records
 * @body		{ name ,subTasks}
 */

router.post("/", (req, res, next) => {
  new Task(req.body)
    .save()
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Task  Saved" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		GET /task
 * @desc		Fetch task records
 */

router.get("/", (req, res, next) => {
  let query = {};
  if ("_id" in req.query) query._id = req.query._id;
  if ("name" in req.query) query.name = req.query.name;

  Task.find(query)
    .exec()
    .then((doc) => {
      res.status(200).json({ data: doc });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		PUT /task/:task_id
 * @desc		Edit task records
 */

router.put("/:task_id", (req, res, next) => {
  Task.findByIdAndUpdate(req.params.task_id, req.body, { new: true })
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Task Changed" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		POST /subtasks
 * @desc		Insert task in lead
 * @body
 */

router.post("/subtask/:task", async (req, res, next) => {
  try {
    const doc = await Task.findOneAndUpdate(
      { _id: req.params.task },
      { $push: { subtasks: req.body } }
    );
    return res.status(200).json({ doc: doc, message: "Sub task added." });
  } catch (err) {
    res.status(500).json({ message: "Couldn't add sub task." });
  }
});

/**
 * @route		PUT /task/:subTaskId
 * @desc		Edit task records
 */
router.put("/subtask/:subTaskId", (req, res, next) => {
  Task.findOne({ "subTasks._id": req.params.subTaskId })
    .then((doc) => {
      const subtask = doc.subTasks.id(req.params.subTaskId);
      subtask.set(req.body);
      return doc.save();
    })
    .then((task) => {
      return res.status(200).json({ data: task, message: "Sub task Updated" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
