"use client";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { useSelector } from "react-redux";
export default function LeftSidebar() {
  const { user } = useSelector((state) => state.app);
  console.log(user);

  return (
    <div className="bg-[color:var(--background)] w-[30%] p-10 h-screen space-y-4 hidden lg:block shadowbox">
      <Typography component="h3">{user?.name}</Typography>
      <p className="text-gray-500">{user?.email}</p>
      <p>
        <img className="w-[100px]" src={user?.photo} alt="" />
      </p>
      <p>
        <Link href="/updateProfile">
          <Button
            className="bg-rose-500"
            endIcon={<EditIcon />}
            variant="contained"
          >
            Edit Profile
          </Button>
        </Link>
      </p>
    </div>
  );
}
