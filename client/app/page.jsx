"use client";
import { signInWithGoogleRedirect, auth } from "@/components/firebase";
import { setUser, incButton } from "@/redux/appSlice";
import { Button, Container, Icon } from "@mui/material";
import axios from "axios";
import { getRedirectResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InstagramIcon from "@mui/icons-material/Instagram";
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [needSignIn, setNeedSignIn] = useState(true);
  const dispatch = useDispatch();
  const { user, buttonClicked } = useSelector((state) => state.app);
  const router = useRouter();
  console.log(user);
  async function handleGoogle(e) {
    dispatch(incButton());
    await signInWithGoogleRedirect();
  }
  async function afterRedirect() {
    const res = await getRedirectResult(auth);

    if (res?.user) {
      dispatch(
        setUser({
          email: res.user.email,
          photo: res.user.photoURL,
          name: res.user.displayName,
          uid: res.user.uid,
        })
      );

      await axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND}/auth/signin`,
          {
            email: res.user.email,
            photo: res.user.photoURL,
            name: res.user.displayName,
            uid: res.user.uid,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          router.push("/profile");
        });
    }
  }
  // useEffect(() => {
  //   setLoading(true);
  // }, [user]);
  useEffect(() => {
    if (buttonClicked < 1) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    if (user?.name) {
      setNeedSignIn(false);
      router.push("/profile");
    } else {
      afterRedirect();
    }
  }, []);

  return (
    <Container
      className="bg-[color:var(--background)] text-[color:var(--text)] min-h-screen mx-0"
      disableGutters
    >
      <p>
        <InstagramIcon
          fontSize="300"
          className="text-rose-60 text-[color:var(--text-color)]"
        />
      </p>
      {loading && <p className="text-rose-600">Redirecting</p>}
      {needSignIn && (
        <Button
          variant="contained"
          className="text-[color:var(--secondary)]"
          onClick={handleGoogle}
        >
          Continue With Google
        </Button>
      )}
    </Container>
  );
}
