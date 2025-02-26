"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import Sidebar from "../../components/Sidebar";
import { useEffect } from "react";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  
  useEffect(() => {
    console.log("Home page rendering, user:", user?.email);
    console.log("Loading state:", loading);
  }, [user, loading]);

  if (loading) {
    console.log("Home page loading state");
    return null;
  }

  console.log("Home page rendering sidebar");
  return (
    <div>
      <Sidebar />
    </div>
  );
}