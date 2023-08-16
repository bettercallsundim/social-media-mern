"use client";
import FriendSidebar from "@/components/FriendSidebar";
import LeftSidebar from "@/components/LeftSidebar";
import MyTimeline from "@/components/MyTimeline";
import { Container, Grid, Item } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Profile() {
  return (
    <div className="w-full">
      <div className="flex">
        <LeftSidebar  />
        <MyTimeline />
        <FriendSidebar />
      </div>
    </div>
  );
}
