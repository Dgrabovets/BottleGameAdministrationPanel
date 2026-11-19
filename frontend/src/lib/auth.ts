/** Logs out through the API and returns to the login page */
export async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Logout failed:", error);
  }

  window.location.href = "/login";
}
