"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "@/redux/appSlice";
import { Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
export default function LeftSidebar() {
  const { user } = useSelector((state) => state.app);
  console.log(user);

  return (
    <div className="bg-[color:var(--background)] w-[30%] p-10 h-screen space-y-4 hidden lg:block">
      <Typography component="h3">{user?.name}</Typography>
      <p className="text-gray-500">{user?.email}</p>
      <p>
        <img src={user?.photo} alt="" />
      </p>
      <p>
        <Link href="/updateProfile">
          <Button endIcon={<EditIcon />} variant="contained">
            Edit Profile
          </Button>
        </Link>
      </p>
    </div>
  );
}
