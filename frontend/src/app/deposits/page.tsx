"use client";
import { Deposits } from "@/components/Tables/deposits";
import { useEffect, useState } from "react";

const TablesPage = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setToken(token);
    }
  }, []);

  if (!token) {
    return <div>No Auth</div>;
  }
  return (
    <>
      <div className="space-y-10">
        <Deposits />
      </div>
    </>
  );
};

export default TablesPage;
