import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Бэк Django
const REFRESH_THRESHOLD = 60; // Кол-во секунд до истечения access_token для его обновления

export function getAccessToken() {
  if (typeof window !== "undefined") {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
  }
  return null;
}

export function getRefreshToken() {
  if (typeof window !== "undefined") {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("refresh_token="))
      ?.split("=")[1];
  }
  return null;
}

// ✅ Декодируем JWT, чтобы узнать, когда он истекает
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

// ✅ Проверяем, истекает ли access_token
function isTokenExpiringSoon(token: string) {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  const expiresIn = decoded.exp - Math.floor(Date.now() / 1000); // Разница в секундах
  return expiresIn < REFRESH_THRESHOLD; // Если истекает через 60 секунд, обновляем заранее
}

// ✅ Функция обновления access_token через refresh_token
async function refreshAccessToken() {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const response = await axios.post(`${API_URL}/auth/api/jwt/refresh/`, {
      refresh: refreshToken,
    });

    document.cookie = `access_token=${response.data.access}; path=/; secure; HttpOnly;`;
    return response.data.access;
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    logout();
    return null;
  }
}

// ✅ Автоматически добавляем токен в запросы и обновляем, если нужно
export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  let token = getAccessToken();
  if (token && isTokenExpiringSoon(token)) {
    token = await refreshAccessToken();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function logout() {
  // document.cookie =
  //   "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  // document.cookie =
  //   "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  // window.location.href = "/login";
}

// ✅ Функция для выполнения логина и установки cookies
export async function login(email: string, password: string) {
  try {
    const response = await axios.post(
      `${API_URL}/auth/api/jwt/create/`,
      {
        email,
        password,
      },
      {
        withCredentials: true, // Обязательно!
      },
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка при логине:", error);
    throw new Error("Неверные учетные данные");
  }
}
