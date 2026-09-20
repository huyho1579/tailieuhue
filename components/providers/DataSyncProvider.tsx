"use client";
import { useEffect, useCallback } from "react";
import { useDocumentStore } from "@/lib/store/documentStore";
import { useCommunityStore } from "@/lib/store/communityStore";
import { useAuthStore } from "@/lib/store/auth";
import { createClient } from "@/lib/supabase/client";

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const syncDocs = useDocumentStore((state) => state.syncFromSupabase);
  const syncPosts = useCommunityStore((state) => state.syncFromSupabase);

  const syncAll = useCallback(() => {
    syncDocs();
    syncPosts();
  }, [syncDocs, syncPosts]);

  useEffect(() => {
    // 1. Đồng bộ ngay khi mount
    syncAll();

    // 2. Re-sync khi người dùng quay lại tab
    const handleFocus = () => {
      syncAll();
    };
    window.addEventListener("focus", handleFocus);

    // 3. Re-sync định kỳ mỗi 30 giây
    const interval = setInterval(syncAll, 30000);

    // 4. Lắng nghe trạng thái đăng nhập Google từ Supabase
    const supabase = createClient();
    let subscription: any = null;

    if (supabase) {
      const handleSession = (session: any, forceLogin = false) => {
        if (session?.user?.email) {
          const authState = useAuthStore.getState();
          const email = session.user.email;

          // Nếu người dùng đã đăng nhập rồi → không ghi đè profile đã chỉnh sửa
          if (!forceLogin && authState.currentUser && authState.currentUser.email === email) {
            return;
          }

          const name =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            email.split("@")[0];
          const avatar = session.user.user_metadata?.avatar_url;

          authState.loginWithGoogle({
            email,
            name,
            avatar,
            asAdmin: email.trim().toLowerCase() === "huyho1579@gmail.com",
          });
        }
      };

      // Kiểm tra phiên đăng nhập hiện tại (chỉ login nếu chưa có user)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          handleSession(session);
        }
      });

      // Lắng nghe thay đổi đăng nhập / đăng xuất
      const { data } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session) {
            // Chỉ force login khi thực sự đăng nhập mới (SIGNED_IN), không ghi đè khi refresh token
            const isNewLogin = event === "SIGNED_IN";
            handleSession(session, isNewLogin);
          } else if (event === "SIGNED_OUT") {
            useAuthStore.getState().logoutUser();
          }
        }
      );
      subscription = data.subscription;
    }

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [syncAll]);

  return <>{children}</>;
}
