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
      const handleSession = (session: any) => {
        if (session?.user?.email) {
          const email = session.user.email;
          const name =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            email.split("@")[0];
          const avatar = session.user.user_metadata?.avatar_url;

          useAuthStore.getState().loginWithGoogle({
            email,
            name,
            avatar,
            asAdmin: email.trim().toLowerCase() === "huyho1579@gmail.com",
          });
        }
      };

      // Kiểm tra phiên đăng nhập hiện tại
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          handleSession(session);
        }
      });

      // Lắng nghe thay đổi đăng nhập / đăng xuất
      const { data } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session) {
            handleSession(session);
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
