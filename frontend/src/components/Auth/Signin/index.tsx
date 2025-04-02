"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import React, { SyntheticEvent, useState } from "react";
import InputGroup from "../../FormElements/InputGroup";
import { useRouter } from "next/router";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <>
      <div>
      </div>
    </>
  );
}
