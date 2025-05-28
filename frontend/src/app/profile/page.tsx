"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { useState } from "react";
import { CameraIcon } from "./_components/icons";

export default function Page() {
  const [data, setData] = useState({
    name: "Admin User",
    profilePhoto: "/images/user/download.png",
    coverPhoto: "/images/cover/cover-01.png",
  });

  const getUserFromStorage = () => {
    try {
      const userRaw = localStorage.getItem("user");
      if (!userRaw) return null;
      return JSON.parse(userRaw);
    } catch {
      return null;
    }
  };

  const storedUser = getUserFromStorage();

  const USER = {
    name: storedUser?.role || "Unknown Role",
    email: storedUser?.userEmail || "test@gmail.com",
    img: "/images/user/download.png",
  };

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={data?.coverPhoto}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              {USER?.img && (
                <>
                  <Image
                    src={USER.img}
                    width={160}
                    height={160}
                    className="overflow-hidden rounded-full"
                    alt="profile"
                  />
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {USER?.name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
