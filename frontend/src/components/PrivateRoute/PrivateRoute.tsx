"use client";

import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  requiredRole?: string;
};

export default function PrivateRoute({
  children,
  requiredRole = "Admin",
}: Props) {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (session.role !== requiredRole) {
      router.replace("/");
    }
  }, [loading, session, requiredRole, router]);

  if (loading || !session || session.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
