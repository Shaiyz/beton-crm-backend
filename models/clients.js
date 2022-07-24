const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  email: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  phone2: {
    type: String,
    minlength: 10,
  },
  cnicFront: {
    type: String,
  },
  cnicBack: {
    type: String,
  },
  clientId: {
    type: String,
    unique: true,
    minlength: 8,
  },
  address: {
    type: String,
  },
  cnic: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

clientSchema.pre("validate", function (next) {
  const num = global.CLIENTS + parseInt(process.env.CLIENT_INITIAL_POS) + "";
  var id = `${"0".repeat(9 - num.length)}${num}`;
  this.clientId = id;
  global.CLIENTS += 1;
  next();
});

const Client = mongoose.model("clients", clientSchema);

module.exports = Client;
