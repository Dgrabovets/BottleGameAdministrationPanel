import * as Icons from "../icons";

type MenuItemType = {
  title: string;
  url?: string;
  items: { url: string }[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type SectionType = {
  label: string;
  items: MenuItemType[];
};

export const NAV_DATA: SectionType[] = [
  {
    label: "Главное меню",
    items: [
      {
        title: "Главная",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "Игроки",
        icon: Icons.User,
        url: "/players",
        items: [],
      },
      {
        title: "Вывод средств",
        icon: Icons.Withdraw,
        url: "/withdraws",
        items: [],
      },
      {
        title: "Пополнение баланса",
        url: "/deposits",
        icon: Icons.Wallet,
        items: [],
      },
      {
        title: "Топ-100 Игроков",
        icon: Icons.Alphabet,
        url: "/top-players",
        items: [],
      },
    ],
  },
  {
    label: "Другое",
    items: [
      {
        title: "Настройки игры",
        icon: Icons.FourCircle,
        url: "/settings",
        items: [],
      },
      {
        title: "Модераторы",
        icon: Icons.User,
        url: "/moderators",
        items: [],
      },
    ],
  },
];
