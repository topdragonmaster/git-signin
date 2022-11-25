const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  url: String,
  avatarUrl: String,
  nodeId: String,
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
