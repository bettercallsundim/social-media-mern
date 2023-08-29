"use client";
import React, { useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import EditIcon from "@mui/icons-material/Edit";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { AddAPhoto, ChatBubble } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { Modal, TextField } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 24,
  p: 4,
  backgroundColor: "var(--secondary)",
  borderRadius: "3%",
};
export default function PostCard({ post, clickTrack }) {
  const [editting, setEditting] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const { user } = useSelector((state) => state.app);
  const [commented, setCommented] = useState(0);
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
          setData(res?.data?.post);
          setComment("");
          ref.current.scrollIntoView();
        });
    } catch (error) {
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
        <div className="modal bg-[color:var(--secondary)] rounded-md">
          <Modal open={open} onClose={handleClose} className="rounded-md">
            <Box sx={style}>
              <div className="overflow-y-scroll h-[300px] relative">
                {data?.comments?.map((comm) => {
                  return (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="photo">
                        <Avatar src={comm?.user?.photo} />
                      </div>
                      <div className="comm">
                        <p className="font-semibold">{comm?.user?.name}</p>
                        <p>{comm?.comment}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={ref}></div>
              </div>

              <form onSubmit={handleComment} encType="multipart/form-data">
                <TextField
                  sx={{ width: "70%" }}
                  id="outlined-multiline-flexible"
                  label="Write a comment"
                  multiline
                  maxRows={4}
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  name="comment"
                  type="text"
                />
                <br />
                <br />
                <Button
                  size="small"

                  className="bg-rose-500"
                  variant="contained"
                  type="submit"
                >
                  Comment
                </Button>
              </form>
            </Box>
          </Modal>
        </div>
      </div>
      <Card sx={{ maxWidth: 345, my: 8 }}>
        <CardHeader
          avatar={<Avatar src={post?.authorPic} />}
          action={
            user.uid == post?.author ? (
              <IconButton
                onClick={() => setEditting(true)}
                aria-label="Edit post"
              >
                <EditIcon />
              </IconButton>
            ) : null
          }
          title={data?.authorName}
          subheader={data?.updatedAt}
        />
        {data?.photo && !editting && (
          <CardMedia
            component="img"
            image={`${process.env.NEXT_PUBLIC_BACKEND}${data?.photo}`}
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
