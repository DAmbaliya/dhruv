const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
    mobileNo: {
      type: Number,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", studentSchema);
module.exports = user;
