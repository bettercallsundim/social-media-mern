// import * as React from "react";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
// import { useSelector } from "react-redux";
// import { Avatar, TextField } from "@mui/material";
// import axios from "axios";
// import { useEffect } from "react";
// import { useRef } from "react";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   boxShadow: 24,
//   p: 4,
//   backgroundColor: "var(--secondary)",
//   borderRadius: "3%",
// };

// export default function BasicModal({
//   open,
//   post,
//   setCommented,
//   commented,
//   setOpen,
//   comments,
// }) {
//   const [comment, setComment] = React.useState("");
//   // const [comments, setComments] = React.useState([]);
//   const { user } = useSelector((state) => state.app);
//   const ref = useRef(null);
//   const handleClose = () => {
//     setOpen(false);
//   };
//   console.log("comment renrendered");
//   // async function fetchComment() {
//   //   await axios
//   //     .get(`${process.env.NEXT_PUBLIC_BACKEND}/post/${post?._id}/comment`, {
//   //       withCredentials: true,
//   //     })
//   //     .then((res) => {
//   //       setComments(res.data.comments);
//   //       console.log("fetch comments", res.data.comments);
//   //     });
//   // }
//   async function handleComment(e) {
//     e.preventDefault();
//     try {
//       await axios
//         .post(
//           `${process.env.NEXT_PUBLIC_BACKEND}/post/${post?._id}/comment/${user?.uid}`,
//           {
//             comment,
//           },
//           {
//             withCredentials: true,
//           }
//         )
//         .then((res) => {
//           console.log(res.data);
//           setComment("");
//           setCommented(commented + 1);
//           ref.current.scrollIntoView();
//         });
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   // useEffect(() => {
//   //   fetchComment();
//   // }, [open]);
//   console.log("From comment: ", post.post, post);
//   return (
//     <div className="modal bg-[color:var(--secondary)] rounded-md">
//       <Modal open={open} onClose={handleClose} className="rounded-md">
//         <Box sx={style}>
//           <div className="overflow-y-scroll h-[300px] relative">
//             {post?.comments?.map((comm) => {
//               return (
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="photo">
//                     <Avatar src={comm?.user?.photo} />
//                   </div>
//                   <div className="comm">
//                     <p className="font-semibold">{comm?.user?.name}</p>
//                     <p>{comm?.comment}</p>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={ref}></div>
//           </div>

//           <form onSubmit={handleComment} encType="multipart/form-data">
//             <TextField
//               sx={{ width: "70%" }}
//               id="outlined-multiline-flexible"
//               label="Write a comment"
//               multiline
//               maxRows={4}
//               onChange={(e) => setComment(e.target.value)}
//               value={comment}
//               name="comment"
//               type="text"
//             />
//             <br />
//             <br />

//             <Button
//               size="small"
//               sx={{
//                 backgroundColor: "var(--accent)",
//                 color: "black",
//               }}
//               className=""
//               variant="contained"
//               type="submit"
//             >
//               Comment
//             </Button>
//           </form>
//         </Box>
//       </Modal>
//     </div>
//   );
// }
