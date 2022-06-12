const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const { sendEmail } = require("../util");
const crypto = require("crypto");

/**
 *  CREATE USER MODEL EITHER FOR ADMIN OR CUSTOMER
 */

const User = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "'first_name' must be required"],
    },
    last_name: {
      type: String,
      required: [true, "'last_name' must be required"],
    },
    email: {
      type: String,
      unique: [true, "'email' must be unique"],
    },
    profilePicture: {
      type: String,
    },
    cnic: {
      type: String,
    },
    phone: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    age: {
      type: Number,
      default: 18,
    },
    gender: {
      type: String,
      enum: ["F", "M"],
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["teamLead", "salesRep", "digitalMarketer"],
    },
    crm_code: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

User.pre("validate", function (next) {
  var first_string = "";
  var rcode = "";
  if (this.first_name !== undefined) {
    let name = this.first_name.charAt(0).toUpperCase();
    first_string = first_string + name;
  }

  if (this.last_name !== undefined) {
    let l_name = this.last_name[0].charAt(0).toUpperCase();
    first_string = first_string + l_name;
  }
  if (this.role !== undefined) {
    rcode = this.role[0].charAt(0).toUpperCase();
  }
  const num = global.USERS + parseInt(process.env.USER_INITIAL_POS) + "";
  this.crm_code = `${first_string}-${"0".repeat(
    5 - num.length
  )}${num}-${rcode}`;
  global.USERS += 1;
  next();
});

User.pre("save", function (next) {
  if (!this.password) this.password = process.env.DEFAULT_USER_PASSWORD;
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

User.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  return resetToken;
};

User.statics.checkPassword = function (pass, hashedPass) {
  return bcrypt.compareSync(pass, hashedPass);
};

module.exports = mongoose.model("users", User);
