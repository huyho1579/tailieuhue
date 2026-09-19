import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Post, mockPosts } from "@/lib/data/mock";
import { db } from "@/lib/supabase/db";

interface CommunityStoreState {
  posts: Post[];
  deletePost: (id: string) => void;
  addPost: (postData: {
    title: string;
    content: string;
    type: "discussion" | "qa" | "share" | "experience";
    author: { name: string; username: string; avatar: string };
    tags: string[];
    authorEmail?: string;
  }) => Post;
  getPostBySlug: (slug: string) => Post | undefined;
  syncFromSupabase: () => Promise<void>;
}

export const useCommunityStore = create<CommunityStoreState>()(
  persist(
    (set, get) => ({
      posts: mockPosts,

      syncFromSupabase: async () => {
        try {
          const supabasePosts = await db.getPosts();
          if (supabasePosts && supabasePosts.length > 0) {
            set({ posts: supabasePosts });
          }
        } catch (e) {
          console.warn("Lỗi đồng bộ bài viết Supabase:", e);
        }
      },

      deletePost: (id: string) => {
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        }));

        db.deletePost(id).catch((err) => {
          console.warn("Lỗi xóa bài viết trên Supabase:", err);
        });
      },

      addPost: (postData) => {
        const slug = postData.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);

        const newPost: Post = {
          id: `post-${Date.now()}`,
          title: postData.title.trim(),
          slug,
          excerpt: postData.content.slice(0, 140) + "...",
          content: postData.content.trim(),
          type: postData.type,
          author: postData.author,
          likes: 0,
          comments: 0,
          bookmarks: 0,
          createdAt: new Date(),
          tags: postData.tags,
        };

        set((state) => ({
          posts: [newPost, ...state.posts],
        }));

        // Ghi lên Supabase
        db.insertPost({
          ...newPost,
          authorEmail: postData.authorEmail || `${postData.author.username}@tailieuhue.com`,
        }).catch((err) => {
          console.warn("Lỗi tạo bài viết trên Supabase:", err);
        });

        return newPost;
      },

      getPostBySlug: (slug: string) => {
        return get().posts.find((p) => p.slug === slug);
      },
    }),
    {
      name: "edudocs-community-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
