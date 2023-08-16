import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Modal from "@/components/Modal";
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
import { useSelector } from "react-redux";
import { ChatBubble } from "@mui/icons-material";
export default function PostCard({ post, type }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const { user } = useSelector((state) => state.app);
  const [commented, setCommented] = useState(0);
  const [fp, setFp] = useState(post);
  const handleClose = () => {
    setOpen(false);
  };
  async function handleLike(id) {
    await axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND}/post/like/${id}/${user.uid}`, {
        withCredentials: true,
      })
      .then((res) => {
        setFp(res.data.newpost);
      });
  }
  useEffect(() => {
    async function getPost() {
      await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND}/post/getPost/${post._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setFp(res.data.post);
        });
    }
    getPost();
  }, []);
  return (
    <div>
      <Modal
        commented={commented}
        setCommented={setCommented}
        post={post}
        handleClose={handleClose}
        open={open}
      />
      <Card sx={{ maxWidth: 345, my: 8 }}>
        <CardHeader
          avatar={<Avatar src={post?.authorPic} />}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={post?.authorName}
          subheader={post?.updatedAt}
        />
        {post?.photo && (
          <CardMedia
            component="img"
            image={`${process.env.NEXT_PUBLIC_BACKEND}${post?.photo}`}
            alt="Paella dish"
            sx={{ height: 300 }}
          />
        )}
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {post?.post}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            onClick={() => handleLike(post?._id)}
            aria-label="add to favorites"
          >
            {fp?.likes.includes(user?.uid) ? (
              <FavoriteIcon sx={{ color: "red" }} />
            ) : (
              <FavoriteIcon />
            )}
          </IconButton>
          <span>{fp?.likes.length}</span>
          <IconButton onClick={handleOpen} sx={{ ml: 4 }} aria-label="comment">
            <ChatBubble />
          </IconButton>
          <span>{fp?.comments.length + commented}</span>
        </CardActions>
      </Card>
    </div>
  );
}
