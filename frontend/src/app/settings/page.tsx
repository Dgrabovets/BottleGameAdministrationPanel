"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SettingsForm } from "./_components/settings-from";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем только в браузере
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setAuthToken(token);
    }
  }, []);

  if (authToken === null) {
    return <div>No Auth</div>;
  }
  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Настройки" />

      <div className="gap-8">
        <div>
          <SettingsForm />
        </div>
      </div>
    </div>
  );
}
