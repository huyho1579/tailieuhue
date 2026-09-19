"use client";
import { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Star,
  Eye,
  Download,
  FileText,
  ShoppingCart,
  Heart,
  ChevronRight,
  Lock,
  Building2,
  CheckCircle2,
  GraduationCap,
  MessageSquarePlus,
  ExternalLink,
  FolderCheck,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { useDocumentStore, DetailedDocument } from "@/lib/store/documentStore";
import { useLibraryStore } from "@/lib/store/libraryStore";
import { useAuthStore } from "@/lib/store/auth";
import { mockDocuments } from "@/lib/data/mock";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const TABS = ["Mô tả tài liệu", "Thông tin chi tiết", "Đánh giá & Nhận xét", "Tài liệu cùng môn"];

const GRADIENT_THEMES: Record<string, string> = {
  blue: "from-blue-600 via-blue-700 to-indigo-900",
  emerald: "from-emerald-600 via-teal-700 to-slate-900",
  purple: "from-purple-600 via-indigo-700 to-slate-900",
  amber: "from-amber-500 via-orange-600 to-slate-900",
};

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { documents } = useDocumentStore();
  const { purchaseDocument, isPurchased, toggleSaveDocument, isSaved } = useLibraryStore();
  const { isAdmin } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [reviews, setReviews] = useState<{ name: string; rating: number; text: string; date: string }[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lấy tài liệu theo slug
  const doc: DetailedDocument = useMemo(() => {
    const found = documents.find((d) => d.slug === slug);
    if (found) return found;
    const fallback = mockDocuments.find((d) => d.slug === slug) || mockDocuments[0];
    return {
      ...fallback,
      department: "Khoa Quản trị kinh doanh",
      semester: "Học kỳ 1 • 2024–2025",
      lecturer: "Bộ môn chuyên ngành HCE",
      fileFormat: "Google Drive",
      driveUrl: "https://drive.google.com/drive/folders/edudocs-hce-sample",
      coverTheme: "blue",
      highlights: [
        "Hệ thống hóa toàn bộ công thức và lý thuyết cốt lõi bám sát đề thi cuối kỳ.",
        "Bao gồm đề thi thử và câu hỏi trắc nghiệm / tự luận có đáp án.",
        "Biên soạn chuẩn theo khung chương trình Đại học Kinh tế Huế.",
      ],
    };
  }, [slug, documents]);

  const hasPurchased = mounted ? isPurchased(doc.id) : false;
  const saved = mounted ? isSaved(doc.id) : false;

  // Lấy danh sách tài liệu cùng môn
  const relatedDocs = useMemo(() => {
    return documents.filter(
      (d) => d.subject.toLowerCase() === doc.subject.toLowerCase() && d.id !== doc.id
    );
  }, [doc, documents]);

  const handleClaimFree = () => {
    purchaseDocument(doc);
    alert("Đã lưu tài liệu vào mục 'Tài liệu đã mua' trong trang cá nhân của bạn!");
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    setReviews([
      {
        name: "Hồ Huy (Bạn)",
        rating: userRating,
        text: newReviewText.trim(),
        date: "Vừa xong",
      },
      ...reviews,
    ]);
    setNewReviewText("");
  };

  const gradientClass = doc.coverTheme && GRADIENT_THEMES[doc.coverTheme]
    ? GRADIENT_THEMES[doc.coverTheme]
    : GRADIENT_THEMES.blue;

  const targetDriveLink = doc.driveUrl || "https://drive.google.com/drive/folders/edudocs-hce";

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-slate-700">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/tai-lieu" className="hover:text-slate-700">
          Tài liệu ĐH Kinh tế Huế
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-blue-600 font-medium">{doc.subject}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold truncate max-w-[280px]">{doc.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Left: Banner Bìa + Tabs chi tiết */}
        <div>
          {/* Banner Bìa & Ảnh nền */}
          <div
            className={cn(
              "relative rounded-[24px] h-88 flex flex-col items-center justify-center text-center p-6 overflow-hidden shadow-md border border-slate-200",
              doc.coverImage ? "bg-slate-950" : `bg-gradient-to-br ${gradientClass}`
            )}
          >
            {doc.coverImage && (
              <img
                src={doc.coverImage}
                alt={doc.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
            )}

            <div className="absolute inset-0 bg-radial from-transparent to-black/30 pointer-events-none" />

            <div className="relative z-10 text-white max-w-xl space-y-2.5 px-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white mb-1 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-blue-200" />
                <span>Đại học Kinh tế Huế • {doc.department || "Khoa chuyên môn"}</span>
              </div>

              <h1 className="text-xl md:text-2xl font-extrabold leading-tight text-white drop-shadow-xs">
                {doc.title}
              </h1>

              <p className="text-xs md:text-sm text-white/90 font-medium">
                Môn học: <strong className="text-amber-300">{doc.subject}</strong> • {doc.pages} trang (Lưu trữ Google Drive)
              </p>
            </div>

            {/* Khóa PRO overlay nếu chưa mua */}
            {doc.isPro && !hasPurchased && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 z-20 px-4 text-center">
                <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center shadow-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <p className="font-bold text-white text-base">Tài liệu PRO độc quyền</p>
                <p className="text-xs text-slate-300 max-w-sm">
                  Mua tài liệu để nhận ngay link truy cập Google Drive đầy đủ trong trang cá nhân của bạn.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8">
            <div className="flex gap-1.5 bg-slate-100 rounded-[14px] p-1.5 mb-6 overflow-x-auto shadow-inner">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "flex-1 py-2.5 px-3 text-sm font-bold rounded-[10px] transition-all whitespace-nowrap cursor-pointer",
                    activeTab === i
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {tab}
                  {i === 3 && relatedDocs.length > 0 && (
                    <span className="ml-1.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                      {relatedDocs.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB 0: MÔ TẢ TÀI LIỆU */}
            {activeTab === 0 && (
              <div className="bg-white border border-slate-200 rounded-[20px] p-6 md:p-8 text-slate-700 leading-relaxed space-y-6 shadow-xs">
                <div>
                  <h3 className="font-bold text-slate-950 text-base mb-2">Tóm tắt tài liệu</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{doc.description}</p>
                </div>

                {doc.highlights && doc.highlights.length > 0 && (
                  <div className="p-5 bg-blue-50/60 rounded-[16px] border border-blue-100/80 space-y-3">
                    <h4 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Điểm nổi bật & Trọng tâm kiến thức
                    </h4>
                    <ul className="space-y-2 text-xs md:text-sm text-slate-700">
                      {doc.highlights.map((point, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span>Biên soạn và cập nhật theo khung chương trình Đại học Kinh tế — Đại học Huế.</span>
                </div>
              </div>
            )}

            {/* TAB 1: THÔNG TIN CHI TIẾT */}
            {activeTab === 1 && (
              <div className="bg-white border border-slate-200 rounded-[20px] p-6 md:p-8 shadow-xs">
                <h3 className="font-bold text-slate-950 text-base mb-4">Thông số kỹ thuật & Học phần</h3>
                <div className="divide-y divide-slate-100">
                  {[
                    ["Môn học", doc.subject],
                    ["Khoa trực thuộc", doc.department || "Khoa Quản trị kinh doanh"],
                    ["Trường đại học", "Đại học Kinh tế — Đại học Huế"],
                    ["Loại tài liệu", doc.type === "de-cuong" ? "Đề cương ôn tập" : doc.type === "de-thi" ? "Đề thi học phần" : "Slide bài giảng"],
                    ["Số trang", `${doc.pages} trang`],
                    ["Nơi lưu trữ file", "Google Drive Cloud Storage"],
                    ["Học kỳ / Năm học", doc.semester || "Học kỳ 1 • 2024–2025"],
                    ["Giảng viên / Bộ môn", doc.lecturer || "Bộ môn chuyên ngành HCE"],
                    ["Người đăng tải", doc.author],
                    ["Trạng thái truy cập", hasPurchased || !doc.isPro ? "Đã cấp quyền (Có trong Trang cá nhân)" : "Khóa bảo mật cho người mua"],
                    ["Ngày xuất bản", new Date(doc.uploadedAt).toLocaleDateString("vi-VN")],
                    ["Lượt xem thực tế", `${doc.viewCount} lượt xem`],
                    ["Lượt tải thực tế", `${doc.downloadCount} lượt tải`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between py-3.5 text-sm"
                    >
                      <span className="text-slate-500 font-medium">{label}</span>
                      <span className="font-bold text-slate-900 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ĐÁNH GIÁ & NHẬN XÉT */}
            {activeTab === 2 && (
              <div className="bg-white border border-slate-200 rounded-[20px] p-6 md:p-8 space-y-6 shadow-xs">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-[14px] border border-dashed border-slate-200">
                    <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-800 text-sm">Chưa có đánh giá nào</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Hãy là người đầu tiên để lại nhận xét cho tài liệu này!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((r, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-[12px] border border-slate-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-sm text-slate-900">{r.name}</span>
                          <span className="text-xs text-slate-400">{r.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={cn(
                                "w-3.5 h-3.5",
                                idx < r.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-200"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-slate-700">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleAddReview} className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <MessageSquarePlus className="w-4 h-4 text-blue-600" />
                    Viết nhận xét của bạn
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-500">Đánh giá sao:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setUserRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={cn(
                              "w-4 h-4",
                              star <= userRating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Nhận xét chất lượng tài liệu môn học này..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-blue-400 mb-3"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-[8px] transition-colors cursor-pointer"
                  >
                    Gửi đánh giá
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: TÀI LIỆU CÙNG MÔN */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-950 text-base">
                    Các tài liệu khác môn {doc.subject} ({relatedDocs.length})
                  </h3>
                  {mounted && isAdmin && (
                    <Link
                      href="/tai-lieu/dang-tai"
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      + Đăng tài liệu mới cùng môn (Admin)
                    </Link>
                  )}
                </div>

                {relatedDocs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedDocs.map((d) => (
                      <DocumentCard key={d.id} doc={d} />
                    ))}
                  </div>
                ) : (
                  <div className="col-span-2 text-center py-12 text-slate-400 bg-white rounded-[20px] border border-slate-200 p-6">
                    <p className="text-sm font-bold text-slate-700">Chưa có tài liệu nào khác cho môn {doc.subject}</p>
                    {mounted && isAdmin && (
                      <Link
                        href="/tai-lieu/dang-tai"
                        className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-[8px]"
                      >
                        Đăng tài liệu ngay (Admin)
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Mua & Mở Link Drive */}
        <div>
          <div className="sticky top-24 bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm space-y-4">
            <Badge variant={doc.isPro ? "pro" : "free"}>
              {doc.isPro ? "TÀI LIỆU PRO" : "MIỄN PHÍ"}
            </Badge>

            <h2 className="font-extrabold text-slate-950 text-lg leading-snug">{doc.title}</h2>

            <div className="flex items-center gap-2 text-xs text-slate-500 pb-3 border-b border-slate-100">
              <span className="text-blue-700 font-bold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> ĐH Kinh tế Huế
              </span>
              <span className="ml-auto">{doc.viewCount} lượt xem</span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Khoa:</span>
                <span className="font-bold text-slate-900">{doc.department || "Khoa QTKD"}</span>
              </div>
              <div className="flex justify-between">
                <span>Môn học:</span>
                <span className="font-bold text-slate-900">{doc.subject}</span>
              </div>
              <div className="flex justify-between">
                <span>Lưu trữ:</span>
                <span className="font-bold text-blue-700">Google Drive Cloud</span>
              </div>
              <div className="flex justify-between">
                <span>Học kỳ:</span>
                <span className="font-bold text-slate-900">{doc.semester || "HK1 2024-2025"}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              {doc.isPro ? (
                <div>
                  <div className="text-2xl font-black text-slate-950 mb-0.5">
                    {formatPrice(doc.price)}
                  </div>
                  <p className="text-[11px] text-slate-500">Mở khóa vĩnh viễn và lưu vào Trang cá nhân</p>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-black text-emerald-600 mb-0.5">Miễn phí hoàn toàn</div>
                  <p className="text-[11px] text-slate-500">Lưu vào Trang cá nhân và mở link Google Drive</p>
                </div>
              )}
            </div>

            {/* Trạng thái ĐÃ SỞ HỮU / ĐÃ MUA */}
            {hasPurchased || !doc.isPro ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[12px] text-xs text-emerald-800 leading-relaxed">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
                    <FolderCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    Đã lưu vào Trang cá nhân của bạn
                  </div>
                  Link Google Drive đã mở khóa, sẵn sàng để xem và tải về.
                </div>

                {/* NÚT MỞ LINK GOOGLE DRIVE TRỰC TIẾP */}
                <a
                  href={targetDriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (!hasPurchased) purchaseDocument(doc);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[12px] transition-colors text-sm shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Mở Link Google Drive
                </a>

                <Link
                  href="/dashboard/da-mua"
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-[10px] text-xs hover:bg-slate-50 transition-colors"
                >
                  Xem trong mục Tài liệu đã mua
                </Link>
              </div>
            ) : (
              /* NÚT MUA TÀI LIỆU PRO */
              <Link
                href={`/checkout?docId=${doc.id}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[12px] transition-colors text-sm shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                Mua ngay — {formatPrice(doc.price)}
              </Link>
            )}

            <button
              onClick={() => toggleSaveDocument(doc.id)}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2.5 border rounded-[12px] text-xs font-bold transition-colors cursor-pointer",
                saved
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              )}
            >
              <Heart className={cn("w-3.5 h-3.5", saved && "fill-current")} />
              {saved ? "Đã lưu vào Yêu thích" : "Lưu vào Yêu thích"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
