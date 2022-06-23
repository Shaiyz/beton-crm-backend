const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subTask = new Schema({
  name: { type: String, required: true },
});

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subTasks: [subTask],
  },
  { timestamps: true }
);

const Task = mongoose.model("tasks", taskSchema);
module.exports = Task;
