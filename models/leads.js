const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const task = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    subtask: {
      type: String,
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
  { timeStamps: true }
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
      ref: "unit",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    tasks: [task],
  },
  { timestamps: true }
);

const Lead = mongoose.model("leads", leadSchema);

module.exports = Lead;
