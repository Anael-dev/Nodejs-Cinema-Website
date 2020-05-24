const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  UserName: String,
  Password: String,
});

module.exports = mongoose.model("users", UserSchema);
