"use client";
import { AddAPhoto, ChatBubble } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Modal, TextField } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  boxShadow: 24,
  p: 4,
  borderRadius: "3%",
};
export default function PostCard({ post, clickTrack }) {
  const [editting, setEditting] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const { user } = useSelector((state) => state.app);
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState({});
  const [isLiked, setIsLiked] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = React.useState("");
  const fileRef = useRef(null);

  const [doc, setDoc] = useState({ post: post?.post, photo: "" });

  const ref = useRef(null);
  const handleClose = () => {
    setOpen(false);
  };
  async function handleLike(id) {
    await axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND}/post/like/${id}/${user.uid}`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data?.newpost);
        setIsLiked(res.data?.newpost?.likes?.includes(user?.uid));
        setLikeCount(res.data?.newpost?.likes?.length);
      });
  }
  async function handleComment(e) {
    e.preventDefault();
    try {
      setisLoading(true);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND}/post/${post?._id}/comment/${user?.uid}`,
          {
            comment,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setisLoading(false);
          setData(res?.data?.post);
          setComment("");
          ref.current.scrollIntoView();
        });
    } catch (error) {
      setisLoading(false);
      console.error(error);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", doc.photo);
    formData.append("authorPhoto", user.photo);
    formData.append("authorName", user.name);
    formData.append("post", doc.post);
    formData.append("uid", user.uid);
    formData.append("pid", post._id);
    try {
      await axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND}/post/updatePost`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          setDoc({
            ...doc,
            post: res?.data?.newPost?.post,
            photo: res?.data?.newPost?.photo,
          });
          setData({
            ...data,
            post: res?.data?.newPost?.post,
            photo: res?.data?.newPost?.photo,
          });
          setEditting(false);
          console.log("race", res);
        });
      // dispatch(getPosts(user.uid));
      // await fetchPosts();
      // setDoc({ post: "", photo: "" });
      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file", error);
    }
  }
  useEffect(() => {
    async function getPost() {
      await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND}/post/getPost/${post._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data?.post);
          setIsLiked(res.data?.post?.likes?.includes(user?.uid));
          setLikeCount(res.data?.post?.likes?.length);
        });
    }
    getPost();
  }, [clickTrack]);
  return (
    <div>
      <div>
        <div className="modal rounded-md bg-[color:var(--background)]">
          <Modal open={open} onClose={handleClose} className="rounded-md ">
            <Box
              sx={style}
              className="bg-[color:var(--background)] w-full sm:w-[400px]"
            >
              <div className="overflow-y-scroll h-[300px] relative">
                <p className="text-center">
                  {data?.comments?.length == 0 && "No comments"}
                </p>
                {data?.comments?.map((comm) => {
                  return (
                    <div className="flex items-center gap-4 mb-6">
                      <div className="photo">
                        <Avatar src={comm?.user?.photo} />
                      </div>
                      <div className="comm w-[80%]">
                        <p className="font-semibold flex items-center justify-between">
                          <span>{comm?.user?.name} </span>
                          <span className="text-[color:var(--primary)] text-sm opacity-80">
                            {moment(comm?.date).fromNow()}
                          </span>
                        </p>

                        <p>{comm?.comment}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={ref}></div>
              </div>

              <form onSubmit={handleComment} encType="multipart/form-data">
                <textarea
                  className="text-[color:var(--text)] bg-[color:var(--background)] border-2 border-gray-400 p-3 rounded-md w-[90%]"
                  rows="2"
                  placeholder="Write a comment ..."
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  name="comment"
                  type="text"
                ></textarea>

                <br />
                <br />
                <Button
                  disabled={isLoading}
                  size="small"
                  className="bg-rose-500"
                  variant="contained"
                  type="submit"
                >
                  Comment
                </Button>
                <p>{isLoading && "loading ..."}</p>
              </form>
            </Box>
          </Modal>
        </div>
      </div>
      <Card
        className="bg-[color:var(--primary)] p-2"
        sx={{ maxWidth: 345, my: 8 }}
      >
        <CardHeader
          avatar={<Avatar src={post?.authorPic} />}
          action={
            user?.uid == post?.author ? (
              <IconButton
                onClick={() => setEditting(true)}
                aria-label="Edit post"
              >
                <EditIcon />
              </IconButton>
            ) : null
          }
          title={data?.authorName}
          subheader={moment(data?.updatedAt).fromNow()}
        />
        {data?.photo && !editting && (
          <CardMedia
            component="img"
            image={`${data?.photo}`}
            alt="Paella dish"
            sx={{ height: 300 }}
          />
        )}
        {!editting && (
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {data?.post}
            </Typography>
          </CardContent>
        )}
        {editting && (
          <div className="mt-4">
            <form encType="multipart/form-data">
              <TextField
                sx={{ width: "70%" }}
                id="outlined-multiline-flexible"
                label="update post"
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
                onClick={handleUpdate}
                size="small"
                sx={{
                  backgroundColor: "var(--primary)",
                }}
                className="bg-rose-500"
                variant="contained"
                type="submit"
              >
                Done
              </Button>
            </form>
          </div>
        )}
        <CardActions disableSpacing>
          <IconButton onClick={() => handleLike(data?._id)}>
            {isLiked ? (
              <FavoriteIcon sx={{ color: "red" }} />
            ) : (
              <FavoriteIcon />
            )}
          </IconButton>
          <span>{likeCount}</span>
          <IconButton onClick={handleOpen} sx={{ ml: 4 }} aria-label="comment">
            <ChatBubble />
          </IconButton>
          <span>{data?.comments?.length}</span>
        </CardActions>
      </Card>
    </div>
  );
}
