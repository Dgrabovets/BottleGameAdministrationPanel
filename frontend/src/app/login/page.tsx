"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import Link from "next/link";
import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";

interface DecodedToken {
  [key: string]: any;
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const submitAuth = async (e: SyntheticEvent) => {
    e.preventDefault();

    const response = await fetch(`${apiUrl}/auth/admin-login`, {
      method: "POST",
      body: JSON.stringify({ login: email, password: password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status != 200) {
      setError("Не валидные данные");
      return null;
    }
    const data = await response.json();
    const token = data?.token;

    if (!token) {
      setError("Токен не получен");
      return;
    }

    localStorage.setItem("token", data?.token);
    const decoded: DecodedToken = jwtDecode(token);

    const userId =
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];
    const userEmail =
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    // const role = "Dolboeb";
    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    localStorage.setItem("user", JSON.stringify({ userId, userEmail, role }));

    router.push("/");

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <Breadcrumb pageName="Авторизация" />

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <form onSubmit={submitAuth}>
                <InputGroup
                  type="email"
                  label="Почта"
                  className="mb-4 [&_input]:py-[15px]"
                  placeholder="Введите почту"
                  name="email"
                  handleChange={(e) => setEmail(e.target.value)}
                  value={email}
                  icon={<EmailIcon />}
                />

                <InputGroup
                  type="password"
                  label="Пароль"
                  className="mb-5 [&_input]:py-[15px]"
                  placeholder="Введите пароль"
                  name="password"
                  handleChange={(e) => setPassword(e.target.value)}
                  value={password}
                  icon={<PasswordIcon />}
                />

                {error && <p className="mb-4 text-red-600">{error}</p>}

                <div className="mb-4.5">
                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
                  >
                    Войти
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
              <Link className="mb-10 inline-block" href="/">
                <h1>GLG Studio</h1>
              </Link>
              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                Войдите в ваш аккаунт
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                С возвращением!
              </h1>

              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                Пожалуйста войдите в аккаунт заполнив необходимые поля ниже
              </p>

              <div className="mt-31">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={325}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
