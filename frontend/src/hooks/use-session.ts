"use client";

import type { AdminSession } from "@/lib/session";
import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) {
          if (!cancelled) setSession(null);
          return;
        }

        const data = await response.json();
        if (!cancelled) {
          setSession(data.session ?? null);
        }
      } catch {
        if (!cancelled) setSession(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return { session, loading, isAdmin: session?.role === "Admin" };
}
