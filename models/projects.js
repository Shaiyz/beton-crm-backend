const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unit = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["office", "apartment", "plot", "suite", "penthouse"],
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["token", "sold", "available"],
    default: "available",
  },
});

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
    },
    unit: [unit],
    leads: [
      {
        type: Schema.Types.ObjectId,
        ref: "leads",
      },
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("projects", projectSchema);
module.exports = Project;
