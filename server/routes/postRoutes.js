import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import Post from "../models/Post.model.js";
import User from "../models/User.model.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

//create a post with multer
// router.post("/createPost", upload.single("photo"), async (req, res) => {
//   const { post, uid, authorPhoto: authorPic, authorName } = req.body;
//   const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
//   console.log("hiiapic");
//   if (post && uid) {
//     try {
//       const user = await User.findOne({ uid });
//       if (user) {
//         const newPost = new Post({
//           post,
//           photo: photoUrl,
//           author: uid,
//           authorPic,
//           authorName,
//         });
//         await newPost.save();
//         res.json({
//           success: true,
//           message: "post created successfully",
//         });
//       }
//     } catch (error) {
//       res.json({ success: false, message: "post creation failed" });
//       console.log(error);
//     }
//   }
// });
//create a post with cloudinary
router.post("/createPost", async (req, res) => {
  const { post, uid, authorPhoto: authorPic, authorName, photo } = req.body;
  console.log(req.body);
  if (post && uid) {
    try {
      const user = await User.findOne({ uid });
      if (user) {
        const newPost = new Post({
          post,
          photo,
          author: uid,
          authorPic,
          authorName,
        });
        await newPost.save();
        res.json({
          success: true,
          message: "post created successfully",
        });
      }
    } catch (error) {
      res.json({ success: false, message: "post creation failed" });
      console.log(error);
    }
  }
});

// update a post
router.post("/updatePost", upload.single("photo"), async (req, res) => {
  const { post: posto, uid, pid } = req.body;
  let photoUrl;
  if (req.file) {
    photoUrl = `/uploads/${req.file.filename}`;
  } else {
    const postt = await Post.findOne({ _id: new mongoose.Types.ObjectId(pid) });
    photoUrl = postt.photo;
  }
  if (posto || photoUrl) {
    try {
      // const user = await User.findOne({ uid });
      const post = await Post.findOne({
        _id: new mongoose.Types.ObjectId(pid),
      });
      if (post.author == uid) {
        const newPost = await Post.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(pid) },
          {
            post: posto,
            photo: photoUrl,
          },
          { new: true }
        );
        console.log(newPost, "new post");
        res.json({
          success: true,
          message: "post updated successfully",
          newPost,
        });
      }
    } catch (error) {
      res.json({ success: false, message: "post update failed" });
      console.log(error);
    }
  }
});

// get all posts of a particular user
router.get("/getPosts/:id", async (req, res) => {
  const { id: uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    const posts = await Post.find({ author: uid });
    res.json({ success: true, posts });
  } catch (error) {
    res.json({ success: false, message: "post finding failed" });
    console.log(error);
  }
});
// get feed posts
router.get("/getFeedPosts/:id", async (req, res) => {
  console.log("hello feed postssssss");
  const { id: uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    const posts = await Post.find({ author: uid });
    const resp = [...posts];
    for (let index = 0; index < user.friends.length; index++) {
      const friendPosts = await Post.find({
        author: user.friends[index],
      });
      resp.push(...friendPosts);
    }
    console.log(resp);
    res.json({ success: true, posts: resp });
  } catch (error) {
    res.json({ success: false, message: "post finding failed" });
    console.log(error);
  }
});

// get a single post by _id
router.get("/getPost/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({ _id: id });
    res.json({ success: true, post });
  } catch (error) {
    res.json({ success: false, message: "post finding failed" });
    console.log(error);
  }
});

// like-unlike a post
router.get("/like/:id/:by", async (req, res) => {
  const { id: postID, by } = req.params;
  try {
    const post = await Post.findOne({
      _id: new mongoose.Types.ObjectId(postID),
    });
    if (post.likes.includes(by)) {
      post.likes = post.likes.filter((id) => id !== by);
    } else {
      post.likes.push(by);
    }
    await post.save();
    res.json({
      success: true,
      message: "post liked successfully",
      newpost: post,
    });
  } catch (error) {
    res.json({ success: false, message: "post like failed" });
    console.log(error);
  }
});

//comment on a post
router.post("/:postid/comment/:uid", async (req, res) => {
  const { postid, uid } = req.params;
  try {
    const post = await Post.findOne({
      _id: new mongoose.Types.ObjectId(postid),
    });
    const user = await User.findOne({ uid });
    if (post) {
      post.comments.push({
        user: user,
        comment: req.body.comment,
        date: Date.now(),
      });
      await post.save();
      res.json({ success: true, message: "comment done", post });
    } else {
      res.json({ success: false, message: "comment failed, post not found" });
    }
  } catch (error) {
    res.json({ success: false, message: "commenting failed" });
    console.log(error);
  }
});
//get all comments of a particular post
router.get("/:postid/comment", async (req, res) => {
  const { postid } = req.params;
  if (postid) {
    console.log("post idddddddd", postid);
    try {
      const post = await Post.findOne({
        _id: new mongoose.Types.ObjectId(postid),
      });
      if (post) {
        res.json({
          success: true,
          message: "comment fetching done",
          comments: post.comments,
        });
      } else {
        res.json({
          success: false,
          message: "comment fethcing failed, post not found",
        });
      }
    } catch (error) {
      res.json({ success: false, message: "commenting fetching failed" });
      console.log(error);
    }
  }
});
export default router;
