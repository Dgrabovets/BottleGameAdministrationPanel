import * as logos from "@/assets/logos";
import { toast } from "react-toastify";

interface GameParams {
  baseWinChance: number; // число с плавающей точкой
  minWinChance: number; // целое число
  maxWinChance: number; // целое число
  chanceDecPerThrowMin: number; // целое число
  chanceDecPerThrowMax: number; // целое число
  chanceDecPerRotation: number; // целое число
  minRotationWinChance: number; // целое число
  minMultiplier: number; // число с плавающей точкой
  maxMultiplier: number; // число с плавающей точкой
  initialBalanceLoss: number; // число с плавающей точкой
  deviationChance: number; // число с плавающей точкой
  maxDeviationPercent: number; // число с плавающей точкой
  minGamesForBoost: number; // целое число
  winBoostChance: number; // число с плавающей точкой
  winBoostMultiplier: number; // число с плавающей точкой
  hardResetChance: number; // число с плавающей точкой
  controlGoal: number; // число с плавающей точкой
  reelAdvanceSpeed: number; // число с плавающей точкой
  uprightThresholdForLine: number; // число с плавающей точкой

  [key: string]: number | undefined;
}


export async function updatePlayer(
  playerId: number,
  name: string,
  balance: number,
  avatar: string,
) {
  try {
    const response = await fetch("https://api.adminbottle.ru/users/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId,
        name,
        balance,
        avatar,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка сервера: ${response.status} ${response.statusText}`,
      );
    }
    toast.success("Пользователь успешно обновлен! ✅");
    return await response.json();
  } catch (error) {
    toast.error("Ошибка обновления пользователя ❌");
    return null;
  }
}

// export async function getPlayerById(playerId: number) {
//   try {
//     const response = await fetch(
//       `https://api.adminbottle.ru/session/list/${playerId}`,
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Ошибка сервера: ${response.status} ${response.statusText}`,
//       );
//     }

//     return await response.json(); // Возвращаем данные пользователя
//   } catch (error) {
//     console.error("Ошибка при получении данных пользователя");
//     return null; // Если ошибка, возвращаем `null`
//   }
// }

export async function getGameParams() {
  try {
    const response = await fetch("https://api.adminbottle.ru/gameparams");

    if (!response.ok) {
      throw new Error(
        `Ошибка сервера: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json(); // Возвращаем данные игры
  } catch (error) {
    console.error("Ошибка при получении данных");
    return null; // Если ошибка, возвращаем `null`
  }
}

export async function updateGameParams(gameParams: GameParams) {
  try {
    const response = await fetch("https://api.adminbottle.ru/gameparams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameParams),
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка при отправке: ${response.status} ${response.statusText}`,
      );
    }

    toast.success("Данные успешно обновлены! ✅");
    return { message: "Данные успешно отправлены" };
  } catch (error) {
    console.error("Ошибка при отправке данных");
    return { error: "Ошибка при отправке данных" };
  }
}

// export async function getPlayerRounds(playerId: number) {
//   try {
//     // Запрос к API для получения данных о раундах пользователя
//     const response = await fetch(
//       `https://api.adminbottle.ru/round/list/${playerId}`,
//     );

//     // Проверяем успешность ответа
//     if (!response.ok) {
//       throw new Error(
//         `Ошибка сервера: ${response.status} ${response.statusText}`,
//       );
//     }

//     // Возвращаем данные раундов в формате JSON
//     return await response.json();
//   } catch (error) {
//     console.error("Ошибка при получении данных о раундах:");
//     return null; // Если ошибка, возвращаем `null`
//   }
// }
// {
//   id: 1,
//   avatar: "/images/user/download.png",
//   username: "User 1",
//   email: "test@gmail.com",
//   balance: 296,
//   win_rate: "22%",
//   created_at: "1.02.2025",
// },

export async function getWithdraws() {
  return [
    {
      id: 3,
      username: "User 1",
      avatar: "/images/user/download.png",
      amount: 135,
      date: "11.03.2025",
      status: "Ожидает",
    },
    {
      id: 4,
      avatar: "/images/user/download.png",
      username: "User 1",
      amount: 150,
      date: "12.03.2025",
      status: "Ожидает",
    },
    {
      id: 5,
      avatar: "/images/user/download.png",
      username: "User 2",
      amount: 490,
      date: "13.03.2025",
      status: "Оплачено",
    },
  ];
}

export async function getDeposits() {
  return [
    {
      id: 3,
      username: "User 1",
      avatar: "/images/user/download.png",
      amount: 135,
      date: "11.03.2025",
    },
    {
      id: 4,
      avatar: "/images/user/download.png",
      username: "User 1",
      amount: 150,
      date: "12.03.2025",
    },
    {
      id: 5,
      avatar: "/images/user/download.png",
      username: "User 2",
      amount: 490,
      date: "13.03.2025",
    },
  ];
}

export async function getTopPlayers() {
  return [
    {
      id: 1,
      top_number: 1,
      avatar: "/images/user/download.png",
      username: "User 1",
      email: "test@gmail.com",
      balance: 2946,
      win_rate: "82%",
      created_at: "1.02.2025",
    },
    {
      id: 2,
      top_number: 2,
      avatar: "/images/user/download.png",
      username: "User 2",
      email: "test@gmail.com",
      balance: 5446,
      win_rate: "72%",
      created_at: "5.02.2025",
    },
    {
      id: 3,
      top_number: 3,
      avatar: "/images/user/download.png",
      username: "User 3",
      email: "test@gmail.com",
      balance: 4413,
      win_rate: "84%",
      created_at: "11.02.2025",
    },
    {
      id: 4,
      top_number: 4,
      avatar: "/images/user/download.png",
      username: "User 4",
      email: "test@gmail.com",
      balance: 4929,
      win_rate: "92%",
      created_at: "12.02.2025",
    },
  ];
}
export async function getInvoiceTableData() {
  return [
    {
      name: "Free package",
      price: 0.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Business Package",
      price: 99.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Unpaid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Pending",
    },
  ];
}

export async function getTopChannels() {
  return [
    {
      name: "Google",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.google,
    },
    {
      name: "X.com",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.x,
    },
    {
      name: "Github",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.github,
    },
    {
      name: "Vimeo",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.vimeo,
    },
    {
      name: "Facebook",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.facebook,
    },
  ];
}
