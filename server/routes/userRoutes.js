import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.model.js";
import Post from "../models/Post.model.js";
import jwtauth from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();
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

// get all users
router.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: "user finding failed" });
    console.log(error);
  }
});

//get a single user by uid
router.get("/getUser/:id", async (req, res) => {
  try {
    const { id: uid } = req.params;
    const user = await User.findOne({ uid });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "user finding failed" });
    }
  } catch (error) {
    console.log(error);
  }
});

//update a user
router.patch("/update/:id", upload.single("photo"), async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  console.log(req.body);
  let photoUrl;
  console.log(process.env.BACKEND);
  if (req.file) {
    photoUrl = `${process.env.BACKEND}/uploads/${req.file.filename}`;
  } else {
    const user = await User.findOne({ uid: id });
    photoUrl = user.photo;
  }
  if (name || photoUrl) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { uid: id },
        { name, photo: photoUrl },
        { new: true }
      );
      if (updatedUser) {
        res.json({
          success: true,
          user: updatedUser,
          message: "profile updated successfully",
        });
      } else {
        res.json({ success: false, message: "profile update failed" });
      }
    } catch (error) {
      console.log(error);
    }
  }
});

//add-remove friend
router.get("/addFriend/:id/:by", async (req, res) => {
  const { id: uid, by } = req.params;
  try {
    const friend = await User.findOne({ uid });
    const sentBy = await User.findOne({ uid: by });
    if (friend && sentBy) {
      const alreadyFriend = sentBy.friends.find((f) => f === uid);
      if (alreadyFriend) {
        sentBy.friends = sentBy.friends.filter((f) => f !== uid);
        friend.friends = friend.friends.filter((f) => f !== by);
        await sentBy.save();
        await friend.save();
        res.json({ success: true, sentBy, message: "friend removed" });
      } else {
        sentBy.friends.push(friend.uid);
        friend.friends.push(sentBy.uid);
        await sentBy.save();
        await friend.save();
        res.json({ success: true, sentBy, message: "friend added" });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "friend adding failed" });
  }
});

export default router;
