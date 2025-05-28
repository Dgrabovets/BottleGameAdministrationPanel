"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  requiredRole?: string;
};

export default function PrivateRoute({
  children,
  requiredRole = "Admin",
}: Props) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      if (user.role !== requiredRole) {
        router.replace("/");
        return;
      }

      setIsAuthorized(true);
    } catch (err) {
      console.error("Ошибка при проверке авторизации", err);
      router.replace("/login");
    }
  }, [router, requiredRole]);

  if (!isAuthorized) return null;

  return <>{children}</>;
}
