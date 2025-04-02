"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      router.refresh(); // Обновление страницы без перезагрузки
    }
  }, [router]);

  return null;
}
