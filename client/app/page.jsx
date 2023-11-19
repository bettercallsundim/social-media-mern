"use client";
import { auth, signInWithGoogleRedirect } from "@/components/firebase";
import { incButton, setUser } from "@/redux/appSlice";
import InstagramIcon from "@mui/icons-material/Instagram";
import axios from "axios";
import { getRedirectResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [needSignIn, setNeedSignIn] = useState(true);
  const dispatch = useDispatch();
  const { user, buttonClicked } = useSelector((state) => state.app);
  const router = useRouter();
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
    if (buttonClicked == 0) {
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
  }, [buttonClicked]);

  return (
    <div
      className="bg-[color:var(--background)] text-[color:var(--text)] min-h-screen mx-0 flex items-center justify-center"
      disableGutters
    >
      <div className="card border-2 rounded-lg p-10">
        <p className="text-center text-4xl">socialone</p>
        <p className="text-center mb-10">social network</p>
        <p></p>
        {loading && <p className="text-rose-600 text-center">Redirecting</p>}
        {!loading && needSignIn && (
          <button
            className="text-[color:var(--secondary)] hover:scale-105 duration-300"
            onClick={handleGoogle}
          >
            <InstagramIcon
              fontSize="300"
              className="text-rose-60 text-[color:var(--text-color)]"
            />
            <span className="ml-4">Continue With Google</span>
          </button>
        )}
      </div>
    </div>
  );
}
