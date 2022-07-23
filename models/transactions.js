const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "projects",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "clients",
  },
  status: {
    type: String,
    enum: ["token", "sold", "partial"],
  },
});

const Transaction = mongoose.model("transactions", transactionSchema);

module.exports = Transaction;
