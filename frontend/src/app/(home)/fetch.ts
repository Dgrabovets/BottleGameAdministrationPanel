export async function getOverviewData() {
  return {
    views: {
      value: 3456,
      growthRate: 0,
    },
    profit: {
      value: 4220,
      growthRate: 0,
    },
    products: {
      value: 3456,
      growthRate: 0,
    },
    users: {
      value: 3456,
      growthRate: 0,
    },
  };
}

export async function getChatsData() {
  return [
    {
      name: "User 1",
      profile: "/images/user/avatar-placeholder.svg",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "User 2",
      profile: "/images/user/avatar-placeholder.svg",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "User 3",
      profile: "/images/user/avatar-placeholder.svg",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "User 4",
      profile: "/images/user/avatar-placeholder.svg",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "User 5",
      profile: "/images/user/avatar-placeholder.svg",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}
