import { createClient } from "./client";
import { DetailedDocument } from "@/lib/store/documentStore";
import { Post } from "@/lib/data/mock";

// Helper chuyển từ Row Supabase sang DetailedDocument
function mapDocFromDb(row: any): DetailedDocument {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    subject: row.subject,
    department: row.department || "Khoa Quản trị kinh doanh",
    semester: row.semester || "Học kỳ 1 • Năm học 2024–2025",
    lecturer: row.lecturer || "Bộ môn chuyên ngành HCE",
    type: row.type || "de-cuong",
    isPro: Boolean(row.is_pro),
    price: Number(row.price) || 0,
    pages: Number(row.pages) || 20,
    fileFormat: row.file_format || "Google Drive",
    driveUrl: row.drive_url,
    thumbnail: row.cover_image || "",
    coverImage: row.cover_image || "",
    coverTheme: row.cover_theme || "blue",
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    author: row.author || "Hồ Huy (Admin)",
    description: row.description || "",
    rating: Number(row.rating) || 5.0,
    reviewCount: Number(row.review_count) || 0,
    viewCount: Number(row.view_count) || 0,
    downloadCount: Number(row.download_count) || 0,
    uploadedAt: new Date(row.created_at),
    university: "Đại học Kinh tế Huế",
  };
}

export const db = {
  // ─── TÀI LIỆU (DOCUMENTS) ──────────────────────────────
  async getDocuments(): Promise<DetailedDocument[]> {
    const supabase = createClient();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) {
        console.warn("Supabase fetch documents fallback:", error?.message);
        return [];
      }

      return data.map(mapDocFromDb);
    } catch (err) {
      console.error("Lỗi kết nối Supabase:", err);
      return [];
    }
  },

  async insertDocument(doc: DetailedDocument): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("documents").insert({
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        subject: doc.subject,
        department: doc.department,
        semester: doc.semester,
        lecturer: doc.lecturer,
        type: doc.type,
        is_pro: doc.isPro,
        price: doc.price,
        pages: doc.pages,
        file_format: "Google Drive",
        drive_url: doc.driveUrl,
        cover_image: doc.coverImage,
        cover_theme: doc.coverTheme,
        highlights: doc.highlights,
        author: doc.author,
        description: doc.description,
        rating: doc.rating,
        review_count: doc.reviewCount,
        view_count: doc.viewCount,
        download_count: doc.downloadCount,
      });

      if (error) {
        console.error("Lỗi khi thêm tài liệu lên Supabase:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Lỗi kết nối khi thêm tài liệu:", err);
      return false;
    }
  },

  async deleteDocument(id: string): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      return !error;
    } catch (err) {
      return false;
    }
  },

  // ─── LỊCH SỬ MUA (PURCHASES) ───────────────────────────
  async getPurchases(userEmail: string): Promise<string[]> {
    const supabase = createClient();
    if (!supabase || !userEmail) return [];

    try {
      const { data, error } = await supabase
        .from("purchases")
        .select("doc_id")
        .eq("user_email", userEmail);

      if (error || !data) return [];
      return data.map((item) => item.doc_id);
    } catch {
      return [];
    }
  },

  async recordPurchase(userEmail: string, docId: string): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("purchases").insert({
        user_email: userEmail,
        doc_id: docId,
      });
      return !error;
    } catch {
      return false;
    }
  },

  // ─── BÀI VIẾT CỘNG ĐỒNG (POSTS) ───────────────────────
  async getPosts(): Promise<Post[]> {
    const supabase = createClient();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) return [];

      return data.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt || "",
        content: row.content,
        type: row.type || "discussion",
        author: {
          name: row.author_name,
          username: row.author_email.split("@")[0],
          avatar: row.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.author_name}`,
        },
        likes: row.likes || 0,
        comments: row.comments || 0,
        bookmarks: row.bookmarks || 0,
        createdAt: new Date(row.created_at),
        tags: Array.isArray(row.tags) ? row.tags : [],
      }));
    } catch {
      return [];
    }
  },

  async insertPost(post: Omit<Post, "id" | "createdAt" | "likes" | "comments" | "bookmarks"> & { authorEmail: string }): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("posts").insert({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        type: post.type,
        author_name: post.author.name,
        author_email: post.authorEmail,
        author_avatar: post.author.avatar,
        tags: post.tags,
      });

      return !error;
    } catch {
      return false;
    }
  },

  async deletePost(id: string): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      return !error;
    } catch {
      return false;
    }
  },
};
