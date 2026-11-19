import * as Icons from "../icons";

/** One item of the sidebar menu */
type MenuItemType = {
  title: string;
  url?: string;
  items: { url: string }[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Hidden from moderators */
  adminOnly?: boolean;
};

/** One section of the sidebar menu */
type SectionType = {
  label: string;
  items: MenuItemType[];
};

/** Navigation of the sidebar */
export const NAV_DATA: SectionType[] = [
  {
    label: "Main menu",
    items: [
      {
        title: "Home",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "Players",
        icon: Icons.User,
        url: "/players",
        items: [],
      },
      {
        title: "Withdrawals",
        icon: Icons.Withdraw,
        url: "/withdraws",
        items: [],
      },
      {
        title: "Deposits",
        url: "/deposits",
        icon: Icons.Wallet,
        items: [],
      },
      {
        title: "Top 100 players",
        icon: Icons.Alphabet,
        url: "/top-players",
        items: [],
      },
    ],
  },
  {
    label: "Other",
    items: [
      {
        title: "Game settings",
        icon: Icons.FourCircle,
        url: "/settings",
        items: [],
        adminOnly: true,
      },
      {
        title: "Moderators",
        icon: Icons.User,
        url: "/moderators",
        items: [],
        adminOnly: true,
      },
    ],
  },
];
