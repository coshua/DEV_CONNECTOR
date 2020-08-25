const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { json } = require("express");
// POST api/posts
// Create a post
// Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
// GET api/posts
// Get all post
// Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ data: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// GET api/posts/:id
// Get post by id
// Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "No post found" });
    res.json(post);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "No post found" });
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// DELETE api/posts/:id
// Delete post by id
// Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "No post found" });
    //Check user
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    await post.remove();
    res.json({ msg: "Post has been removed" });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "No post found" });
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// PUT api/posts/like/:id
// Update post like
// Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// PUT api/posts/unlike/:id
// Update post like
// Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res
        .status(400)
        .json({ msg: "Cannot dislike post you have not liked" });
    }
    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// POST api/posts/comment/:id
// Comment on a post
// Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const post = await Post.findById(req.params.id);
      const user = await User.findById(req.user.id).select("-password");
      const newCom = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newCom);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
// DELETE api/posts/comment/:id/:comment_id
// Delete a comment on a certain post
// Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "No post found" });

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) return res.status(404).json({ msg: "No comment found" });

    if (comment.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });
    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );
    await post.save();
    return res.json(post.comments);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "No post or comment found" });
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
