"use client";

import { logout } from "@/lib/auth";
import { LogOutIcon } from "./icons";

export function UserInfo() {
  return (
    <button
      type="button"
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-dark transition hover:bg-gray-2 dark:text-white dark:hover:bg-dark-3"
      onClick={() => logout()}
    >
      <LogOutIcon />
      <span className="text-base">Выйти</span>
    </button>
  );
}
