import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Post, mockPosts } from "@/lib/data/mock";
import { db } from "@/lib/supabase/db";

export interface PostComment {
  id: string;
  postId: string;
  name: string;
  text: string;
  time: string;
  likes: number;
}

interface CommunityStoreState {
  posts: Post[];
  deletedPostIds: string[];
  likedPostIds: string[];
  bookmarkedPostIds: string[];
  comments: PostComment[];
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
  toggleLike: (postId: string) => boolean;
  isLiked: (postId: string) => boolean;
  toggleBookmark: (postId: string) => boolean;
  isBookmarked: (postId: string) => boolean;
  addComment: (postId: string, text: string, name?: string) => void;
  getCommentsByPostId: (postId: string) => PostComment[];
  syncFromSupabase: () => Promise<void>;
}

export const useCommunityStore = create<CommunityStoreState>()(
  persist(
    (set, get) => ({
      posts: mockPosts,
      deletedPostIds: [],
      likedPostIds: [],
      bookmarkedPostIds: [],
      comments: [
        {
          id: "cmt-1",
          postId: "1",
          name: "Nguyễn Văn An",
          text: "Bài viết rất hữu ích cho sinh viên K47 mới vào trường!",
          time: "2 giờ trước",
          likes: 3,
        },
      ],

      syncFromSupabase: async () => {
        try {
          const supabasePosts = await db.getPosts();
          const { deletedPostIds, posts } = get();

          if (supabasePosts && supabasePosts.length > 0) {
            // Loại bỏ hoàn toàn những bài đã bị xóa (cả theo id và slug)
            const filteredSupabase = supabasePosts.filter(
              (p) => !deletedPostIds.includes(p.id) && !deletedPostIds.includes(p.slug)
            );

            // Giữ lại các bài viết mới đăng cục bộ chưa kịp ghi lên Supabase
            const existingLocalOnly = posts.filter(
              (lp) =>
                !deletedPostIds.includes(lp.id) &&
                !deletedPostIds.includes(lp.slug) &&
                !filteredSupabase.some((sp) => sp.id === lp.id || sp.slug === lp.slug)
            );

            // Kết hợp bài từ Supabase và bài cục bộ chưa đồng bộ
            set({ posts: [...existingLocalOnly, ...filteredSupabase] });
          } else {
            // Lọc lại bài cục bộ theo blacklist đã xóa
            set({
              posts: posts.filter(
                (p) => !deletedPostIds.includes(p.id) && !deletedPostIds.includes(p.slug)
              ),
            });
          }
        } catch (e) {
          console.warn("Lỗi đồng bộ bài viết Supabase:", e);
        }
      },

      toggleLike: (postId: string) => {
        const { likedPostIds, posts } = get();
        const currentlyLiked = likedPostIds.includes(postId);
        const newLikedIds = currentlyLiked
          ? likedPostIds.filter((id) => id !== postId)
          : [...likedPostIds, postId];

        const newPosts = posts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              likes: Math.max(0, p.likes + (currentlyLiked ? -1 : 1)),
            };
          }
          return p;
        });

        set({
          likedPostIds: newLikedIds,
          posts: newPosts,
        });

        return !currentlyLiked;
      },

      isLiked: (postId: string) => {
        return get().likedPostIds.includes(postId);
      },

      toggleBookmark: (postId: string) => {
        const { bookmarkedPostIds, posts } = get();
        const currentlyBookmarked = bookmarkedPostIds.includes(postId);
        const newBookmarkedIds = currentlyBookmarked
          ? bookmarkedPostIds.filter((id) => id !== postId)
          : [...bookmarkedPostIds, postId];

        const newPosts = posts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              bookmarks: Math.max(0, p.bookmarks + (currentlyBookmarked ? -1 : 1)),
            };
          }
          return p;
        });

        set({
          bookmarkedPostIds: newBookmarkedIds,
          posts: newPosts,
        });

        return !currentlyBookmarked;
      },

      isBookmarked: (postId: string) => {
        return get().bookmarkedPostIds.includes(postId);
      },

      addComment: (postId: string, text: string, name?: string) => {
        const newCmt: PostComment = {
          id: `cmt-${Date.now()}`,
          postId,
          name: name || "Thành viên HCE",
          text: text.trim(),
          time: "Vừa xong",
          likes: 0,
        };

        const { comments, posts } = get();
        const newPosts = posts.map((p) => {
          if (p.id === postId) {
            return { ...p, comments: p.comments + 1 };
          }
          return p;
        });

        set({
          comments: [newCmt, ...comments],
          posts: newPosts,
        });
      },

      getCommentsByPostId: (postId: string) => {
        return get().comments.filter((c) => c.postId === postId);
      },

      deletePost: (id: string) => {
        const { posts, deletedPostIds } = get();
        const targetPost = posts.find((p) => p.id === id);

        // Lưu cả id và slug vào danh sách đã xóa để Supabase không thể phục hồi lại bài
        const newDeletedIds = new Set(deletedPostIds);
        newDeletedIds.add(id);
        if (targetPost?.slug) {
          newDeletedIds.add(targetPost.slug);
        }

        set((state) => ({
          deletedPostIds: Array.from(newDeletedIds),
          posts: state.posts.filter((p) => p.id !== id && (!targetPost?.slug || p.slug !== targetPost.slug)),
          comments: state.comments.filter((c) => c.postId !== id),
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
          excerpt: postData.content.slice(0, 140) + (postData.content.length > 140 ? "..." : ""),
          content: postData.content.trim(),
          type: postData.type,
          author: postData.author,
          likes: 0,
          comments: 0,
          bookmarks: 0,
          createdAt: new Date(),
          tags: postData.tags,
        };

        const { deletedPostIds } = get();
        // Đảm bảo không bị vướng blacklist
        set((state) => ({
          deletedPostIds: deletedPostIds.filter((id) => id !== newPost.id && id !== newPost.slug),
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
        const { posts, deletedPostIds } = get();
        if (deletedPostIds.includes(slug)) return undefined;
        return posts.find((p) => p.slug === slug);
      },
    }),
    {
      name: "edudocs-community-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
