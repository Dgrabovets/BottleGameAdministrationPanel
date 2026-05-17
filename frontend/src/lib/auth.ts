export async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Ошибка выхода:", error);
  }

  window.location.href = "/login";
}
