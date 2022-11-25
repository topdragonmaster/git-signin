const express = require("express");
const {
  editPost,
  deletPost,
  newPost,
  getPosts,
  getUserPosts,
} = require("../controller/postController");

const { gitAuth } = require("../controller/authController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/posts", getPosts);

router.post("/post", auth, newPost);

router.delete("/post/:id", auth, deletPost);

router.put("/post", auth, editPost);

router.post("/gitAuth", gitAuth);

router.get("/posts/:username", auth, getUserPosts);

module.exports = router;
