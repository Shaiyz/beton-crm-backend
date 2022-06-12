const router = require("express").Router();
const { Lead } = require("../models");

/**
 * @route		POST /task
 * @desc		Insert task
 */

router.post("/", async (req, res, next) => {
  try {
    const doc = await Lead.findOneAndUpdate(
      { _id: req.params.lead },
      { $push: { tasks: req.body } }
    );
    return res.status(200).json({ doc: doc, message: "Task added." });
  } catch (err) {
    res.status(500).json({ message: "Couldn't add task." });
  }
});

/**
 * @route		PUT /task/:taskId
 * @desc		Edit task records
 */
router.put("/:taskId", (req, res, next) => {
  Lead.findOne({ "tasks._id": req.params.taskId })
    .then((doc) => {
      const task = doc.tasks.id(addressId);
      task.set(req.body);
      return doc.save();
      //   const address = user.addresses.id(addressId); // returns a matching subdocument
      //   address.set(req.body); // updates the address while keeping its schema
      //   // address.zipCode = req.body.zipCode; // individual fields can be set directly

      //   return user.save(); // saves document with subdocuments and triggers validation
    })
    .then((lead) => {
      return res.status(200).json({ data: lead, message: "Task Updated" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
