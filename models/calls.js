const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const callSchema = new Schema({
  verified: {
    type: Boolean,
    required: true,
  },
  callLength: {
    type: Number,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "clients",
    required: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  endedAt: {
    type: Date,
    required: true,
  },
});

callSchema.pre("save", (next) => {
  var startDate = this.startedAt;
  var endDate = this.endDate;
  var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  this.callLength = seconds;
  next();
});

const Call = mongoose.model("calls", callSchema);
module.exports = Call;
