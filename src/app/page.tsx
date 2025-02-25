"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import Sidebar from "../../components/Sidebar";

export default function Home() {
  const [loading] = useAuthState(auth);

  if (loading) return null; 

  return (
    <div>
      <Sidebar />
    </div>
  );
}
