"use client";
import Feed from "@/components/Feed";
import FriendSidebar from "@/components/FriendSidebar";
import LeftSidebar from "@/components/LeftSidebar";
import MyTimeline from "@/components/MyTimeline";
import React from "react";

export default function feed() {
  return (
    <div className="w-full">
      <div className="flex">
        <LeftSidebar />
        <Feed />
        <FriendSidebar />
      </div>
    </div>
  );
}
