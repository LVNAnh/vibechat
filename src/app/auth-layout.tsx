"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Login from "./login/page"; 
import { auth, db } from "../config/firebase"; 
import Loading from "../../components/Loading";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      }
      if (user && pathname === "/login") {
        router.replace("/");
      }
    }
  }, [user, loading, pathname, router])

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, "users", user?.email as string),
          {
            email: user?.email,
            lastSeen: serverTimestamp(),
            photoURL: user?.photoURL,
          },
          { merge: true }
        );
      } catch (error) {
        console.log("ERROR SETTING USER INFO IN DATABASE", error);
      }
    };

    if (user?.email) {
      setUserInDb();
    }
  }, [user]) 

  if (loading) return <Loading />;

  if (!user && pathname !== "/login") {
    return <Login />;
  }

  return <>{children}</>;
}
