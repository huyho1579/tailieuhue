import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Document, mockDocuments } from "@/lib/data/mock";
import { db } from "@/lib/supabase/db";

// Mở rộng Document type với các trường chi tiết
export interface DetailedDocument extends Document {
  department?: string; // Khoa chuyên môn
  semester?: string; // Học kỳ & Năm học
  lecturer?: string; // Giảng viên phụ trách
  fileFormat?: string; // PDF, PPTX, DOCX
  driveUrl?: string; // Link Google Drive / Đám mây
  coverImage?: string; // URL ảnh nền / bìa hoặc Data URL base64
  coverTheme?: string; // Theme màu bìa
  highlights?: string[]; // Các điểm trọng tâm ôn thi
}

interface DocumentStoreState {
  documents: DetailedDocument[];
  addDocument: (doc: Omit<DetailedDocument, "id" | "slug" | "uploadedAt" | "rating" | "reviewCount" | "viewCount" | "downloadCount">) => DetailedDocument;
  deleteDocument: (id: string) => void;
  getDocumentBySlug: (slug: string) => DetailedDocument | undefined;
  syncFromSupabase: () => Promise<void>;
}

// Map chính xác từng khoa cho các tài liệu ban đầu của ĐH Kinh tế Huế
const getInitialDepartment = (subject: string): string => {
  if (subject.includes("Kế toán")) return "Khoa Kế toán — Kiểm toán";
  if (subject.includes("Tài chính")) return "Khoa Tài chính — Ngân hàng";
  if (subject.includes("Vi mô") || subject.includes("Vĩ mô") || subject.includes("Kinh tế Lượng")) return "Khoa Kinh tế & Phát triển";
  if (subject.includes("Tin học") || subject.includes("Hệ thống")) return "Khoa Hệ thống thông tin kinh tế";
  return "Khoa Quản trị kinh doanh";
};

// Khởi tạo dữ liệu gốc với link Drive và khoa chính xác
const INITIAL_DOCS: DetailedDocument[] = mockDocuments.map((doc, i) => ({
  ...doc,
  department: getInitialDepartment(doc.subject),
  semester: "Học kỳ 1 • Năm học 2024–2025",
  lecturer: "Bộ môn chuyên ngành HCE",
  fileFormat: "Google Drive",
  driveUrl: `https://drive.google.com/drive/folders/tailieuhue-${doc.slug || i}`,
  coverTheme: "blue",
  coverImage: "",
  highlights: [
    "Hệ thống hóa toàn bộ công thức và lý thuyết cốt lõi bám sát đề thi cuối kỳ.",
    "Bao gồm ví dụ minh họa và câu hỏi trắc nghiệm / tự luận có đáp án.",
    "Biên soạn chuẩn theo khung chương trình Đại học Kinh tế Huế.",
  ],
}));

export const useDocumentStore = create<DocumentStoreState>()(
  persist(
    (set, get) => ({
      documents: INITIAL_DOCS,

      syncFromSupabase: async () => {
        try {
          const supabaseDocs = await db.getDocuments();
          if (supabaseDocs && supabaseDocs.length > 0) {
            set({ documents: supabaseDocs });
          }
        } catch (e) {
          console.error("Lỗi đồng bộ tài liệu từ Supabase:", e);
        }
      },

      addDocument: (newDocData) => {
        const slug = newDocData.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);

        const newDoc: DetailedDocument = {
          ...newDocData,
          id: `doc-${Date.now()}`,
          slug,
          uploadedAt: new Date(),
          rating: 5.0,
          reviewCount: 0,
          viewCount: 1,
          downloadCount: 0,
          university: "Đại học Kinh tế Huế",
          thumbnail: newDocData.coverImage || "",
          driveUrl: newDocData.driveUrl || "https://drive.google.com/drive/folders/tailieuhue",
        };

        set((state) => ({
          documents: [newDoc, ...state.documents],
        }));

        // Đồng bộ lên Supabase ngầm
        db.insertDocument(newDoc).catch((err) => {
          console.warn("Chưa đồng bộ được lên Supabase (bảng documents chưa được tạo):", err);
        });

        return newDoc;
      },

      deleteDocument: (id: string) => {
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        }));

        // Xóa trên Supabase ngầm
        db.deleteDocument(id).catch((err) => {
          console.warn("Lỗi khi xóa trên Supabase:", err);
        });
      },

      getDocumentBySlug: (slug: string) => {
        return get().documents.find((d) => d.slug === slug);
      },
    }),
    {
      name: "edudocs-documents-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
