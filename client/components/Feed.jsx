import { getFeedPosts, getPosts } from "@/redux/postsSlice";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import axios from "axios";
import React, { Component, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "./PostCard";
import { AddAPhoto } from "@mui/icons-material";

export default function Feed() {
  const fileRef = useRef(null);
  const { user } = useSelector((state) => state.app);
  const { feedPosts: posts, loading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [doc, setDoc] = useState({ post: "", photo: "" });
  async function handlePost(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", doc.photo);
    formData.append("authorPhoto", user.photo);
    formData.append("authorName", user.name);
    formData.append("post", doc.post);
    formData.append("uid", user.uid);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/post/createPost`,
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(getFeedPosts(user?.uid));
      setDoc({ post: "", photo: "" });
      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file", error);
    }
  }
  useEffect(() => {
    dispatch(getFeedPosts(user?.uid));
  }, []);

  return (
    <div className="lg:max-h-screen lg:overflow-y-scroll w-[100%] lg:w-[50%] p-10">
      <div>
        <form onSubmit={handlePost} encType="multipart/form-data">
          <TextField
            sx={{ width: "70%" }}
            id="outlined-multiline-flexible"
            label="Write a post"
            multiline
            maxRows={4}
            onChange={(e) =>
              setDoc({ ...doc, [e.target.name]: e.target.value })
            }
            value={doc.post}
            name="post"
            type="text"
          />
          <br />
          <br />
          <label htmlFor="photo">
            <IconButton
              onClick={() => {
                fileRef.current.click();
              }}
              aria-label="delete"
            >
              <AddAPhoto
                sx={{
                  color: "var(--text)",
                  mr: "10px",
                }}
              />
            </IconButton>
            <input
              ref={fileRef}
              onChange={(e) =>
                setDoc({ ...doc, [e.target.name]: e.target.files[0] })
              }
              type="file"
              name="photo"
              id=""
              hidden
            />
          </label>
          <Button
            size="small"
            sx={{
              backgroundColor: "var(--primary)",
            }}
            className="bg-rose-500"
            variant="contained"
            type="submit"
          >
            Submit
          </Button>
        </form>
        <br />
        <br />
        <br />
      </div>
      <hr />
      <h1 className="font-semibold text-xl text-gray-700">News Feed : </h1>
      <div>
        {loading && <CircularProgress color="secondary" />}
        {posts?.map((post) => (
          <PostCard post={post} />
        ))}
      </div>
    </div>
  );
}
