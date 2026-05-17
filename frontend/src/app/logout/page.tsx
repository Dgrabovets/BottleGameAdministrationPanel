"use client";

import { logout } from "@/lib/auth";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    logout();
  }, []);

  return null;
}
