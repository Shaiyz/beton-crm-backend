const router = require("express").Router();
const moment = require("moment");
const { Lead, Call } = require("../models");

/**
 * @route		GET /report
 * @desc		Fetch report of user
 */

router.get("/:user/:startDate/:endDate", async (req, res, next) => {
  const startDate = new Date(req.params.startDate);
  let end = req.params.endDate.split("-");
  let endDay = +end[2] + 1;
  end = `${end[1]}-${endDay}-${end[0]}`;
  const endDate = new Date(end);

  const leadAdded = await Lead.find({
    addedBy: req.params.user,
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  const leadAssigned = await Lead.find({
    assignedTo: req.params.user,
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  });
  let meetingsDone = 0;
  let meetingsArranged = 0;
  const meetings = await Lead.find({
    "leadTasks.createdBy": req.params.user,
    "leadTasks.completed": true,
    "leadTasks.createdAt": {
      $gte: startDate,
      $lt: endDate,
    },
  });
  meetings.forEach((doc) =>
    doc.leadTasks.map((task) => {
      if (task.subtask == req.query.done && task.completed == true) {
        if (
          new Date(task.createdAt).getTime() >= new Date(startDate).getTime() &&
          new Date(task.createdAt).getTime() <= new Date(endDate).getTime()
        ) {
          meetingsDone += 1;
        }
      }
      if (task.subtask == req.query.arrange && task.completed == true) {
        if (
          new Date(task.createdAt).getTime() >= new Date(startDate).getTime() &&
          new Date(task.createdAt).getTime() <= new Date(endDate).getTime()
        ) {
          meetingsArranged += 1;
        }
      }
    })
  );
  let TLW = 0;
  const leadWork = await Lead.find({
    "leadTasks.createdBy": req.params.user,
    "leadTasks.completed": true,
    "leadTasks.createdAt": {
      $gte: startDate,
      $lt: endDate,
    },
  });
  leadWork.forEach((doc) =>
    doc.leadTasks.map((task) => {
      if (task.createdBy == req.params.user && task.completed == true) {
        if (
          new Date(task.createdAt).getTime() >= new Date(startDate).getTime() &&
          new Date(task.createdAt).getTime() <= new Date(endDate).getTime()
        )
          TLW += 1;
      }
    })
  );

  const calls = await Call.find({
    from: req.params.user,
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  const verified = calls.filter((i) => i.verified === true).length;
  const totalTalkTime = calls.reduce((acc, curr) => {
    return (acc += parseInt(curr.duration));
  }, 0);

  const averageTalkTime = totalTalkTime / calls.length;
  const report = {
    verifiedCalls: verified,
    ATT: averageTalkTime,
    TTT: totalTalkTime,
    met: meetingsDone,
    metArranged: meetingsArranged,
    TLW: TLW,
    leadAssigned: leadAssigned.length,
    leadAdded: leadAdded.length,
  };
  return res.status(200).json({ data: report });
});

module.exports = router;
