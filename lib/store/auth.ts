"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/lib/data/mock";

export const ADMIN_CREDENTIALS = {
  email: "huyho1579@gmail.com",
  password: "123321",
};

interface AuthState {
  currentUser: User | null;
  isAdmin: boolean;
  loginAdmin: (email: string, pass: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  loginRegularUser: (email: string, name?: string) => void;
  loginWithGoogle: (payload: {
    email: string;
    name: string;
    avatar?: string;
    asAdmin?: boolean;
  }) => void;
  updateProfile: (data: Partial<User>) => void;
  logoutUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Mặc định khách vãng lai (chưa đăng nhập)
      currentUser: null,
      isAdmin: false,

      loginAdmin: (email: string, pass: string) => {
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
          const adminUser: User = {
            id: "admin-huyho",
            name: "Hồ Huy",
            email: "huyho1579@gmail.com",
            username: "huyho",
            role: "admin",
            university: "Đại học Kinh tế Huế",
            points: 0,
            isPro: true,
          };
          set({
            currentUser: adminUser,
            isAdmin: true,
          });
          return { success: true };
        }
        return {
          success: false,
          error: "Email hoặc mật khẩu quản trị viên không chính xác!",
        };
      },

      logoutAdmin: () => {
        set({
          currentUser: null,
          isAdmin: false,
        });
      },

      loginRegularUser: (email: string, name?: string) => {
        const regularUser: User = {
          id: `user-${Date.now()}`,
          name: name || "Sinh viên HCE",
          email: email.trim().toLowerCase(),
          username: email.split("@")[0] || "sinhvien",
          role: "user",
          university: "Đại học Kinh tế Huế",
          points: 0,
          isPro: false,
        };
        set({
          currentUser: regularUser,
          isAdmin: false,
        });
      },

      loginWithGoogle: ({ email, name, avatar, asAdmin = false }) => {
        const cleanEmail = email.trim().toLowerCase();
        const isAdminUser =
          asAdmin || cleanEmail === ADMIN_CREDENTIALS.email;

        const googleUser: User = {
          id: `google-${Date.now()}`,
          name: name || "Người dùng Google",
          email: cleanEmail,
          username: cleanEmail.split("@")[0],
          role: isAdminUser ? "admin" : "user",
          university: "Đại học Kinh tế Huế",
          points: 0,
          isPro: isAdminUser,
        };

        set({
          currentUser: googleUser,
          isAdmin: isAdminUser,
        });
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => {
          if (!state.currentUser) return state;
          const updatedUser: User = {
            ...state.currentUser,
            ...data,
          };
          const isAdminUser =
            updatedUser.email.trim().toLowerCase() === ADMIN_CREDENTIALS.email;
          if (isAdminUser) {
            updatedUser.role = "admin";
            updatedUser.isPro = true;
          }
          return {
            currentUser: updatedUser,
            isAdmin: isAdminUser,
          };
        });
      },

      logoutUser: () => {
        set({
          currentUser: null,
          isAdmin: false,
        });
      },
    }),
    {
      name: "edudocs-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
