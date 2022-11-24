const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts");

router.get("/posts", async (req, res) => {
  const posts = await Posts.find();
  return res.json({
    data: posts,
  });
});

router.get("/posts/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const post = await Posts.find({ _id: _postId });
  if (post.length) {
    return res.json({ data: post });
  }
});

router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;
  await Posts.create({
    user,
    password,
    title,
    content,
  });
  res.json({ message: "Post have been created successfully." });
});

router.put("/posts/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { password, title, content } = req.body;

  const existsPosts = await Posts.find({ _id: _postId });
  if (existsPosts.length) {
    await Posts.updateOne(
      { _id: _postId },
      {
        $set: {
          password: password,
          title: title,
          content: content,
        },
      }
    );

    return res.json({
      message: "Post have been updated successfully.",
    });
  }
});

router.delete("/posts/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { password } = req.body;

  const existsPost = await Posts.find({ _id: _postId });
  if (existsPost.length > 0 && password === existsPost[0].password) {
    await Posts.deleteOne({ _id: _postId });
    return res.json({ message: "Post have been deleted successfully." });
  }
  return res.json({ message: "Password not valid!" });
});

module.exports = router;
