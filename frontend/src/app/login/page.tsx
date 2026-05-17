"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitAuth = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "Не валидные данные");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Ошибка сети. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
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
                    disabled={loading}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-60"
                  >
                    {loading ? "Вход..." : "Войти"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
              <p className="mb-10 text-heading-5 font-bold text-dark dark:text-white">
                Панель администратора
              </p>
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
