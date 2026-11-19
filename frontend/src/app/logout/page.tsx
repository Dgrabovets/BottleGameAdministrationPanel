"use client";

import { logout } from "@/lib/auth";
import { useEffect } from "react";

/** Logout page: clears the session and returns to the login page */
export default function Logout() {
  useEffect(() => {
    logout();
  }, []);

  return null;
}
