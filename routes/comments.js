const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts");
const Comments = require("../schemas/comments");

router.get("/comments/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const comments = await Comments.find();
  const posts = await Posts.find({ _id: _postId });

  if (posts.length) {
    let result = [];
    comments.filter((comment) => {
      comment.postId === _postId ? result.push(comment) : null;
    });

    return res.json({
      data: result,
    });
  }
});

router.post("/comments/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { user, password, content } = req.body;

  const existPosts = await Posts.find({ _id: _postId });
  if (existPosts.length) {
    await Comments.create({
      user,
      password,
      content,
      postId: _postId,
    });
    return res.json({ message: "Comment have been created successfully." });
  }
  return res.json({ message: "Post not found." });
});

router.put("/comments/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password, content } = req.body;

  const existsComments = await Comments.find({ _id: _commentId });
  if (existsComments.length) {
    await Comments.updateOne(
      { _id: _commentId },
      {
        $set: {
          password: password,
          content: content,
        },
      }
    );

    return res.json({
      message: "Comment have been updated successfully.",
    });
  }
});

router.delete("/comments/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password } = req.body;

  const existsComments = await Comments.find({ _id: _commentId });
  if (existsComments.length > 0 && password === existsComments[0].password) {
    await Comments.deleteOne({ _id: _commentId });
    return res.json({ message: "Comment have been deleted successfully." });
  }
  return res.json({ message: "Password not valid!" });
});

module.exports = router;
