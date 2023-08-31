import { AddAPhoto } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "./PostCard";

export default function RightSidebar() {
  const fileRef = useRef(null);
  const { user } = useSelector((state) => state.app);
  // const { posts, loading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [doc, setDoc] = useState({ post: "", photo: "" });
  const [posts, setPosts] = useState([]);
  const [clickTrack, setClickTrack] = useState(0);
  const fetchPosts = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/post/getPosts/${user?.uid}`,
      {
        credentials: "include",
      }
    );
    const data = await res.json();
    if (data?.posts) {
      let arr = data.posts;
      arr.reverse();
      setPosts(arr);
      console.log("my timeline rerendered", posts);
    }
  };
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
      // dispatch(getPosts(user.uid));
      await fetchPosts();
      setDoc({ post: "", photo: "" });
      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file", error);
    }
    setClickTrack((prev) => prev + 1);
  }
  useEffect(() => {
    // dispatch(getPosts(user?.uid));
    fetchPosts();
  }, [clickTrack]);
  return (
    <div className="max-h-screen overflow-y-scroll hidescroll w-[100%] lg:w-[50%] p-10  bg-[color:var(--background)]">
      <div>
        <form onSubmit={handlePost} encType="multipart/form-data">
          <textarea
            className="text-[color:var(--text)] bg-[color:var(--background)] border-2 border-gray-400 p-3"
            cols="50"
            rows="3"
            placeholder="Write a post ..."
            onChange={(e) =>
              setDoc({ ...doc, [e.target.name]: e.target.value })
            }
            value={doc.post}
            name="post"
            type="text"
          ></textarea>

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
      <h1 className="font-semibold text-xl">Your Posts : </h1>
      <div>
        {/* {loading && <CircularProgress color="secondary" />} */}
        {posts?.map((post, ind) => (
          <PostCard clickTrack={clickTrack} post={post} />
        ))}
      </div>
    </div>
  );
}
