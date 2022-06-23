const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const currentTask = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "task",
      required: true,
    },
    subtask: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
    },
    deadline: {
      type: Date,
    },
    completed: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const leadSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "clients",
      required: true,
    },
    intrested: {
      type: Schema.Types.ObjectId,
      ref: "projects",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    leadTasks: [currentTask],
  },
  { timestamps: true }
);

const Lead = mongoose.model("leads", leadSchema);

module.exports = Lead;