"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/lib/data/mock";

export const ADMIN_CREDENTIALS = {
  email: "huyho1579@gmail.com",
  password: "123321",
};

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  username: string;
  role: "admin" | "user";
  university: string;
  points: number;
  isPro: boolean;
}

export const INITIAL_REGISTERED_USERS: RegisteredUser[] = [
  {
    id: "admin-huyho",
    name: "Hồ Huy",
    email: "huyho1579@gmail.com",
    password: "123321",
    username: "huyho",
    role: "admin",
    university: "Đại học Kinh tế Huế",
    points: 0,
    isPro: true,
  },
  {
    id: "user-nguyenvanan",
    name: "Nguyễn Văn An",
    email: "nguyenvanan.hce@gmail.com",
    password: "123456",
    username: "nguyenvanan",
    role: "user",
    university: "Đại học Kinh tế Huế",
    points: 0,
    isPro: false,
  },
  {
    id: "user-thuha",
    name: "Trần Thị Thu Hà",
    email: "thuha.kinhte@gmail.com",
    password: "123456",
    username: "thuha",
    role: "user",
    university: "Đại học Kinh tế Huế",
    points: 0,
    isPro: false,
  },
];

interface AuthState {
  currentUser: User | null;
  isAdmin: boolean;
  registeredUsers: RegisteredUser[];
  loginAdmin: (email: string, pass: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  registerUser: (payload: {
    name: string;
    email: string;
    password: string;
  }) => { success: boolean; error?: string };
  loginUser: (
    email: string,
    password: string
  ) => { success: boolean; error?: string; isAdmin?: boolean };
  loginRegularUser: (email: string, name?: string) => void;
  loginWithGoogle: (payload: {
    email: string;
    name: string;
    avatar?: string;
    asAdmin?: boolean;
    mode?: "login" | "register";
  }) => { success: boolean; error?: string; isAdmin?: boolean };
  updateProfile: (data: Partial<User>) => void;
  logoutUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAdmin: false,
      registeredUsers: INITIAL_REGISTERED_USERS,

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

      registerUser: ({ name, email, password }) => {
        const cleanEmail = email.trim().toLowerCase();
        const users = get().registeredUsers && get().registeredUsers.length > 0
          ? get().registeredUsers
          : INITIAL_REGISTERED_USERS;

        if (cleanEmail === ADMIN_CREDENTIALS.email) {
          return {
            success: false,
            error: "Email này thuộc về Quản trị viên hệ thống! Vui lòng đăng nhập tại cổng Admin.",
          };
        }

        const existing = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);
        if (existing) {
          return {
            success: false,
            error: "Email này đã được đăng ký tài khoản trước đó! Vui lòng chuyển sang Đăng nhập.",
          };
        }

        const newUser: RegisteredUser = {
          id: `user-${Date.now()}`,
          name: name.trim() || "Sinh viên HCE",
          email: cleanEmail,
          password: password,
          username: cleanEmail.split("@")[0] || `user${Date.now().toString().slice(-4)}`,
          role: "user",
          university: "Đại học Kinh tế Huế",
          points: 0,
          isPro: false,
        };

        const updatedUsers = [...users, newUser];
        set({
          registeredUsers: updatedUsers,
          currentUser: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            role: newUser.role,
            university: newUser.university,
            points: newUser.points,
            isPro: newUser.isPro,
          },
          isAdmin: false,
        });

        return { success: true };
      },

      loginUser: (email: string, password: string) => {
        const cleanEmail = email.trim().toLowerCase();
        const users = get().registeredUsers && get().registeredUsers.length > 0
          ? get().registeredUsers
          : INITIAL_REGISTERED_USERS;

        // 1. Kiểm tra tài khoản Quản trị viên
        if (cleanEmail === ADMIN_CREDENTIALS.email) {
          if (password === ADMIN_CREDENTIALS.password) {
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
            return { success: true, isAdmin: true };
          }
          return {
            success: false,
            error: "Mật khẩu Quản trị viên không chính xác! Vui lòng kiểm tra lại.",
          };
        }

        // 2. Tìm kiếm trong danh sách tài khoản đã đăng ký
        const found = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);

        if (!found) {
          return {
            success: false,
            error: "Tài khoản chưa được đăng ký trên hệ thống! Vui lòng Đăng ký trước khi đăng nhập.",
          };
        }

        // 3. Kiểm tra mật khẩu
        if (found.password && found.password !== password) {
          return {
            success: false,
            error: "Mật khẩu không chính xác! Vui lòng kiểm tra lại.",
          };
        }

        const user: User = {
          id: found.id,
          name: found.name,
          email: found.email,
          username: found.username,
          role: found.role,
          university: found.university,
          points: found.points,
          isPro: found.isPro,
        };

        set({
          currentUser: user,
          isAdmin: false,
        });

        return { success: true, isAdmin: false };
      },

      loginRegularUser: (email: string, name?: string) => {
        // Tương thích ngược: kiểm tra đăng ký hoặc tự đăng ký
        const cleanEmail = email.trim().toLowerCase();
        const users = get().registeredUsers && get().registeredUsers.length > 0
          ? get().registeredUsers
          : INITIAL_REGISTERED_USERS;
        const found = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);

        if (found) {
          set({
            currentUser: {
              id: found.id,
              name: found.name,
              email: found.email,
              username: found.username,
              role: found.role,
              university: found.university,
              points: found.points,
              isPro: found.isPro,
            },
            isAdmin: false,
          });
        } else {
          get().registerUser({
            name: name || "Sinh viên HCE",
            email: cleanEmail,
            password: "",
          });
        }
      },

      loginWithGoogle: ({ email, name, avatar, asAdmin = false, mode = "login" }) => {
        const cleanEmail = email.trim().toLowerCase();
        const isAdminUser = asAdmin || cleanEmail === ADMIN_CREDENTIALS.email;
        const users = get().registeredUsers && get().registeredUsers.length > 0
          ? get().registeredUsers
          : INITIAL_REGISTERED_USERS;
        const found = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);

        // Nếu là Admin
        if (isAdminUser) {
          const adminUser: User = {
            id: "admin-huyho",
            name: name || "Hồ Huy",
            email: cleanEmail,
            username: cleanEmail.split("@")[0],
            role: "admin",
            university: "Đại học Kinh tế Huế",
            points: 0,
            isPro: true,
          };
          set({
            currentUser: adminUser,
            isAdmin: true,
          });
          return { success: true, isAdmin: true };
        }

        // Nếu đang ở chế độ Đăng nhập (mode === "login")
        if (mode === "login" && !found) {
          return {
            success: false,
            error: `Tài khoản Google (${cleanEmail}) chưa được đăng ký trên EduDocs! Vui lòng chọn "Đăng ký với Google".`,
          };
        }

        // Nếu đã có tài khoản hoặc đang ở chế độ Đăng ký (mode === "register")
        let targetUser: User;
        if (found) {
          targetUser = {
            id: found.id,
            name: found.name || name,
            email: found.email,
            username: found.username,
            role: found.role,
            university: found.university,
            points: found.points,
            isPro: found.isPro,
          };
        } else {
          const newUser: RegisteredUser = {
            id: `google-${Date.now()}`,
            name: name || "Sinh viên HCE",
            email: cleanEmail,
            username: cleanEmail.split("@")[0],
            role: "user",
            university: "Đại học Kinh tế Huế",
            points: 0,
            isPro: false,
          };
          set({
            registeredUsers: [...users, newUser],
          });
          targetUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            role: newUser.role,
            university: newUser.university,
            points: newUser.points,
            isPro: newUser.isPro,
          };
        }

        set({
          currentUser: targetUser,
          isAdmin: false,
        });

        return { success: true, isAdmin: false };
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

          // Cập nhật cả trong registeredUsers
          const updatedRegistered = (state.registeredUsers || INITIAL_REGISTERED_USERS).map((u) => {
            if (u.id === updatedUser.id || u.email === updatedUser.email) {
              return {
                ...u,
                ...data,
              };
            }
            return u;
          });

          return {
            currentUser: updatedUser,
            isAdmin: isAdminUser,
            registeredUsers: updatedRegistered,
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
