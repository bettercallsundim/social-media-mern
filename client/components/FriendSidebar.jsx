"use client";
import { getUsers } from "@/redux/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FriendCard } from "./FriendCard";

export default function FriendSidebar({ setRender }) {
  const { users, loading, error } = useSelector((state) => state.user);
  const { user: theuser } = useSelector((state) => state.app);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, []);

  return (
    <div className="bg-[color:var(--background)] w-[30%] p-10 h-screen space-y-4 hidden  lg:block">
      <div>
        <p className="underline font-medium">People You May Know</p>
      </div>
      {users?.map((user) => {
        if (theuser?.uid != user?.uid) {
          return <FriendCard user={user} key={user?.uid} />;
        } else {
          return undefined;
        }
      })}
    </div>
  );
}
