"use client";
import { setUser } from "@/redux/appSlice";
import { AddAPhoto } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const { user } = useSelector((state) => state.app);
  const url = user?.photo;
  const [doc, setDoc] = useState({ name: user?.name, photo: "" });
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  async function handleUpdate(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", doc.photo);
    formData.append("name", doc.name);

    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND}/user/update/${user.uid}`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (res.data.user) {
        dispatch(
          setUser({
            ...user,
            name: res.data.user.name,
            photo: res.data.user.photo,
          })
        );
        setDoc({ name: res.data.user.name, photo: res.data.user.photo });
      }

      console.log("profile updated successfully");
    } catch (error) {
      console.error("profile update failed", error);
    }
  }
  return (
    <div className="max-h-screen overflow-y-scroll w-[100%] p-10">
      <form onSubmit={handleUpdate} encType="multipart/form-data">
        <label htmlFor="name">
          <TextField
            sx={{ width: "70%" }}
            label="Name"
            maxRows={4}
            onChange={(e) => {
              setDoc({ ...doc, [e.target.name]: e.target.value });
            }}
            value={doc.name}
            name="name"
            type="text"
          />
        </label>
        <br />
        <br />
        <label htmlFor="photo">
          Change Profile Picture :
          <IconButton
            onClick={() => {
              fileRef.current.click();
            }}
            aria-label=""
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
          Update
        </Button>
      </form>
    </div>
  );
}
