"use client";
import { useEffect } from "react";
import { useDocumentStore } from "@/lib/store/documentStore";
import { useCommunityStore } from "@/lib/store/communityStore";
import { useAuthStore } from "@/lib/store/auth";
import { createClient } from "@/lib/supabase/client";

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const syncDocs = useDocumentStore((state) => state.syncFromSupabase);
  const syncPosts = useCommunityStore((state) => state.syncFromSupabase);

  useEffect(() => {
    // 1. Đồng bộ tài liệu & bài viết
    syncDocs();
    syncPosts();

    // 2. Lắng nghe trạng thái đăng nhập Google từ Supabase
    const supabase = createClient();
    if (!supabase) return;

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          handleSession(session);
        } else if (event === "SIGNED_OUT") {
          useAuthStore.getState().logoutUser();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [syncDocs, syncPosts]);

  return <>{children}</>;
}
