import { Avatar, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const FriendCard = ({ user }) => {
  const { user: mainUser } = useSelector((state) => state.app);
  const [currUser, setCurrUser] = useState(user);
  async function handleFriend(to) {
    await axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND}/user/addFriend/${to}/${mainUser.uid}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setCurrUser(res.data.sentBy);
      });
  }
  useEffect(() => {
    async function getUser() {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND}/user/getUser/${mainUser?.uid}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setCurrUser(res.data.user);
        });
    }
    getUser();
  }, []);
  return (
    <div>
      <div className="border-gray-400 border-2 p-2 rounded-md mb-4">
        <div className="flex items-center">
          <div className="mr-2">
            <Avatar alt="Remy Sharp" src={user.photo} />
          </div>
          <div>
            <p>{user.name}</p>
            <span>
              <Button
                onClick={() => handleFriend(user.uid)}
                variant="text"
                color="primary"
                size="small"
              >
                {currUser?.friends.includes(user.uid)
                  ? "Unfriend"
                  : "Add Friend"}
              </Button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
