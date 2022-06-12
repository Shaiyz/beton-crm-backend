const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unit = new Schema({
  quantity: {
    type: Number,
    default: 1,
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
});

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
