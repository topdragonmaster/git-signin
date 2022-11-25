const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  login: String,
  context: String,
  isPrivate: Boolean,
  created: Date,
});

module.exports = mongoose.model.Posts || mongoose.model("Posts", PostSchema);
