"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "@/redux/userSlice";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { FriendCard } from "./FriendCard";

export default function FriendSidebar({ setRender }) {
  const { users, loading, error } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.app);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, []);

  return (
    <div className="bg-[color:var(--background)] w-[30%] p-10 h-screen space-y-4 hidden lg:block">
      <div>
        <p className="underline font-medium">People You May Know</p>
      </div>
      {users?.map((user) => (
        <FriendCard user={user} key={user.uid} />
      ))}
    </div>
  );
}
