import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "purchase" | "info" | "system";
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: () => number;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-welcome",
    title: "Chào mừng bạn đến với TailieuHue!",
    message: "Kho đề cương, đề thi và bài giảng chuyên sâu dành riêng cho sinh viên Đại học Kinh tế — Đại học Huế.",
    type: "system",
    read: false,
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    link: "/tai-lieu",
  },
  {
    id: "notif-exam-update",
    title: "Cập nhật đề thi mới — ĐH Kinh tế Huế",
    message: "Đề thi và đáp án các môn Kinh tế Vi mô, Kế toán Tài chính, Marketing Căn bản đã được đồng bộ đầy đủ.",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    link: "/tai-lieu/de-thi",
  },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: DEFAULT_NOTIFICATIONS,

      addNotification: (n) => {
        const newNotif: Notification = {
          ...n,
          id: `notif-${Date.now()}`,
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications].slice(0, 50),
        }));
      },

      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      markRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      unreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: "tailieuhue-notifications-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
