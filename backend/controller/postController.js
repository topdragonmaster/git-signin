const Post = require("../model/postModel");
const mongoose = require("mongoose");

const getPosts = async (_, res) => {
  try {
    const result = await Post.aggregate([
      { $match: { "isPrivate": false}},
      {
        $lookup: {
            from: "users",
            localField: "poster",
            foreignField: "_id",
            as: "poster"
        }
      },
      { $sort : { created : 1} },
      {
        $unwind: '$poster'
      }
  ])
  res.status(200).send({ error: false, result });
  } catch (err) {
    console.log("error", err);
    res.send({ error: true });
  }
};

const getUserPosts = async (req, res) => {
  const { id } = req.user;

  try {
    const posts = await Post.aggregate([
      { $match: { "poster": new mongoose.Types.ObjectId(id)}},
      {
          $lookup: {
              from: "users",
              localField: "poster",
              foreignField: "_id",
              as: "poster"
          }
      },
      { $sort : { created : 1} },
      {
        $unwind: '$poster'
      }
  ])
  const result = posts.sort((a, b) => b.created - a.created);

  res.status(200).send({ error: false, result });
  } catch (err) {
    res.send({ error: true, err });
  }
};

const newPost = async (req, res) => {
  const { context, isPrivate } = req.body;
  const { id } = req.user;
  console.log(context)
  const newPost = new Post({
    poster: id,
    context: context,
    isPrivate: isPrivate,
    created: new Date(),
  });

  newPost.save((err, result) => {
    if (err) {
      res.send({ message: "post add failed!" });
    } else {
      res.send({ message: "Successfully added!" });
    }
  });
};

const deletPost = async (req, res) => {
  const id = req.params.id;
  const result = await Post.deleteOne({ _id: id });
  if (result.deletedCount === 1) {
    res.send({ message: "Successfully deleted", error: false });
  } else {
    res.send({ error: true, message: "delete failed" });
  }
};

const editPost = async (req, res) => {
  const { _id, context, isPrivate } = req.body;
  const { id } = req.user;

  const newPost = new Post({
    _id: _id,
    poster: id,
    context,
    isPrivate,
    created: new Date(),
  });

  try {
    await Post.updateOne({ _id: _id }, newPost);
    res.send({
      error: false,
      newPost,
      message: "Successfully edited the post",
    });
  } catch (err) {
    console.log("Error", err);
    res.send({ error: true });
  }
};

module.exports = { getPosts, newPost, deletPost, editPost, getUserPosts };
