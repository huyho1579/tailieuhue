"use client";
import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Upload,
  Image as ImageIcon,
  Check,
  ChevronRight,
  Plus,
  Trash2,
  Lock,
  Building2,
  BookOpen,
  Layers,
  Link2,
  ExternalLink,
  FolderLock,
  Camera,
  ShieldAlert,
} from "lucide-react";
import { useDocumentStore } from "@/lib/store/documentStore";
import { useAuthStore } from "@/lib/store/auth";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const DEPARTMENTS = [
  "Khoa Quản trị kinh doanh",
  "Khoa Kế toán — Kiểm toán",
  "Khoa Tài chính — Ngân hàng",
  "Khoa Kinh tế & Phát triển",
  "Khoa Hệ thống thông tin kinh tế",
];

const PRESET_SUBJECTS = [
  "Marketing Căn bản",
  "Kế toán Tài chính",
  "Kinh tế Vi mô",
  "Kinh tế Vĩ mô",
  "Quản trị Học",
  "Tài chính Doanh nghiệp",
  "Luật Kinh doanh",
  "Kinh tế Lượng",
  "Nguyên lý Thống kê kinh tế",
  "Quản trị Nhân lực",
];

const COVER_THEMES = [
  { id: "blue", label: "Xanh Kinh tế HCE", gradient: "from-blue-600 to-indigo-800" },
  { id: "emerald", label: "Xanh ngọc Kế toán", gradient: "from-emerald-600 to-teal-800" },
  { id: "purple", label: "Tím Thống kê", gradient: "from-purple-600 to-indigo-900" },
  { id: "amber", label: "Vàng Cam Marketing", gradient: "from-amber-500 to-orange-700" },
];

const SAMPLE_COVERS = [
  {
    name: "Sách & Giảng đường",
    url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Kinh tế & Tài chính",
    url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tài liệu Ôn thi",
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
  },
];

function DangTaiLieuForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addDocument, documents } = useDocumentStore();
  const { isAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Danh sách môn học đồng bộ động từ PRESET và các tài liệu đã có
  const allSubjectOptions = useMemo(() => {
    const list = [...PRESET_SUBJECTS];
    documents.forEach((d) => {
      if (d.subject && !list.includes(d.subject.trim())) {
        list.push(d.subject.trim());
      }
    });
    return list;
  }, [documents]);

  useEffect(() => {
    setMounted(true);
    const sub = searchParams.get("subject");
    if (sub) {
      if (allSubjectOptions.includes(sub)) {
        setSubject(sub);
      } else {
        setSubject("other");
        setCustomSubject(sub);
      }
    }
    const t = searchParams.get("type");
    if (t && ["de-cuong", "de-thi", "slide", "giao-trinh"].includes(t)) {
      setType(t as any);
    }
  }, [searchParams, allSubjectOptions]);

  // Form State
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Marketing Căn bản");
  const [customSubject, setCustomSubject] = useState("");
  const [department, setDepartment] = useState("Khoa Quản trị kinh doanh");
  const [type, setType] = useState<"de-cuong" | "de-thi" | "slide" | "giao-trinh">("de-cuong");
  const [isPro, setIsPro] = useState(false);
  const [price, setPrice] = useState(29000);
  const [pages, setPages] = useState(24);
  const [driveUrl, setDriveUrl] = useState("");
  const [semester, setSemester] = useState("Học kỳ 1 • Năm học 2024–2025");
  const [lecturer, setLecturer] = useState("Bộ môn chuyên ngành HCE");
  const [author, setAuthor] = useState("Hồ Huy (Admin)");

  // Cover Image & Theme
  const [coverType, setCoverType] = useState<"upload" | "preset" | "gradient">("upload");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [selectedGradient, setSelectedGradient] = useState("blue");

  // Description & Highlights
  const [description, setDescription] = useState(
    "Đề cương tổng hợp kiến thức trọng tâm, hệ thống hóa toàn bộ công thức và câu hỏi ôn tập bám sát cấu trúc đề thi kết thúc học phần của Đại học Kinh tế Huế."
  );
  const [highlights, setHighlights] = useState<string[]>([
    "Hệ thống hóa toàn bộ lý thuyết và công thức cốt lõi.",
    "Bao gồm đề thi thử và câu hỏi trắc nghiệm có giải thích.",
    "Bám sát khung giảng dạy chuẩn của ĐH Kinh tế Huế.",
  ]);
  const [newHighlight, setNewHighlight] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const activeSubject = subject === "other" ? customSubject : subject;

  // Lọc tài liệu cùng môn
  const relatedDocs = useMemo(() => {
    if (!activeSubject) return [];
    return documents.filter((d) => d.subject.toLowerCase() === activeSubject.toLowerCase());
  }, [activeSubject, documents]);

  // Xử lý tải ảnh từ máy tính (Local file upload)
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn một tệp hình ảnh hợp lệ (PNG, JPG, JPEG, WEBP)!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCoverImageUrl(dataUrl);
      setCoverType("upload");
    };
    reader.readAsDataURL(file);
  };

  const addHighlightItem = () => {
    if (newHighlight.trim() && highlights.length < 6) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight("");
    }
  };

  const removeHighlightItem = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề tài liệu!");
      return;
    }
    if (subject === "other" && !customSubject.trim()) {
      alert("Vui lòng nhập tên môn học!");
      return;
    }
    if (!driveUrl.trim()) {
      alert("Vui lòng nhập đường link Google Drive của tài liệu!");
      return;
    }

    setSubmitting(true);

    const finalCover = coverType === "gradient" ? "" : coverImageUrl;

    const created = addDocument({
      title: title.trim(),
      subject: activeSubject.trim(),
      department,
      university: "Đại học Kinh tế Huế",
      type,
      isPro,
      price: isPro ? Number(price) : 0,
      pages: Number(pages) || 10,
      fileFormat: "Google Drive",
      driveUrl: driveUrl.trim(),
      semester,
      lecturer,
      author: author.trim() || "Cộng tác viên HCE",
      description: description.trim(),
      thumbnail: finalCover,
      coverImage: finalCover,
      coverTheme: selectedGradient,
      highlights,
    });

    setTimeout(() => {
      setSubmitting(false);
      router.push(`/tai-lieu/${created.slug}`);
    }, 600);
  };

  const currentTheme = COVER_THEMES.find((t) => t.id === selectedGradient) || COVER_THEMES[0];

  if (mounted && !isAdmin) {
    return (
      <div className="max-w-[560px] mx-auto px-4 py-24 text-center animate-fade-in">
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-[20px] flex items-center justify-center mx-auto mb-5 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-950 mb-2">
          Quyền truy cập dành riêng cho Quản trị viên
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Chỉ có Quản trị viên hệ thống Đại học Kinh tế Huế (tài khoản <span className="font-semibold text-slate-900">huyho1579@gmail.com</span>) mới có quyền đăng tải và quản lý kho tài liệu.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/admin"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-[10px] shadow-xs transition-colors"
          >
            Đăng nhập Quản trị viên
          </Link>
          <Link
            href="/tai-lieu"
            className="px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold rounded-[10px] transition-colors"
          >
            Quay lại kho tài liệu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-700">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/tai-lieu" className="hover:text-slate-700">
          Tài liệu ĐH Kinh tế Huế
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold">Đăng tải tài liệu mới</span>
      </nav>

      {/* Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full mb-2 border border-blue-100">
            <Building2 className="w-3.5 h-3.5" />
            Hệ thống đăng bài Đại học Kinh tế Huế
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight">
            Đăng tải tài liệu học tập & Đề thi
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tải ảnh bìa, dán link Google Drive lưu trữ và đồng bộ mô tả chi tiết lên trang cá nhân người mua.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
        {/* Left Column: Form Details */}
        <div className="space-y-8">
          {/* Section 1: Thêm ảnh bìa / Ảnh nền */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-slate-900 text-base">1. Ảnh bìa & Hình nền tài liệu</h2>
              </div>
              <span className="text-xs text-blue-600 font-semibold">Tùy chọn tải ảnh hoặc chọn mẫu</span>
            </div>

            {/* Các tùy chọn thêm ảnh */}
            <div className="flex gap-2 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setCoverType("upload")}
                className={cn(
                  "px-3.5 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer",
                  coverType === "upload"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                Tải ảnh từ máy tính
              </button>
              <button
                type="button"
                onClick={() => setCoverType("preset")}
                className={cn(
                  "px-3.5 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer",
                  coverType === "preset"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                Chọn ảnh mẫu có sẵn
              </button>
              <button
                type="button"
                onClick={() => setCoverType("gradient")}
                className={cn(
                  "px-3.5 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer",
                  coverType === "gradient"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                Màu nền Gradient HCE
              </button>
            </div>

            {/* Tab 1: Upload ảnh từ máy tính */}
            {coverType === "upload" && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLocalImageUpload}
                  className="hidden"
                />

                {coverImageUrl ? (
                  <div className="relative rounded-[16px] overflow-hidden border border-slate-200 group">
                    <img
                      src={coverImageUrl}
                      alt="Ảnh bìa đã tải"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-slate-900 rounded-[8px] text-xs font-bold shadow-md hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" /> Thay ảnh khác
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl("")}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-[8px] text-xs font-bold shadow-md hover:bg-red-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa ảnh
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-[16px] p-8 text-center bg-slate-50/60 hover:bg-blue-50/30 transition-all cursor-pointer space-y-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      Nhấn để tải ảnh bìa từ máy tính hoặc điện thoại
                    </p>
                    <p className="text-xs text-slate-400">
                      Hỗ trợ định dạng PNG, JPG, JPEG, WEBP (Khuyên dùng tỷ lệ ngang 16:9)
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Hoặc dán đường link ảnh:</span>
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://example.com/anh-bia.jpg"
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-[8px] text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Chọn ảnh mẫu */}
            {coverType === "preset" && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Chọn ảnh bìa học thuật có sẵn:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {SAMPLE_COVERS.map((cov) => (
                    <button
                      key={cov.name}
                      type="button"
                      onClick={() => setCoverImageUrl(cov.url)}
                      className={cn(
                        "p-1 rounded-[12px] border-2 transition-all cursor-pointer text-left overflow-hidden",
                        coverImageUrl === cov.url
                          ? "border-blue-600 ring-2 ring-blue-100 shadow-xs"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <img
                        src={cov.url}
                        alt={cov.name}
                        className="h-20 w-full object-cover rounded-[8px]"
                      />
                      <span className="text-[11px] font-bold text-slate-800 mt-1.5 block truncate px-1">
                        {cov.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Gradient nền */}
            {coverType === "gradient" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Chọn tông màu gradient đại diện chuyên ngành HCE:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {COVER_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedGradient(theme.id)}
                      className={cn(
                        "h-14 rounded-[12px] bg-gradient-to-br p-2.5 flex flex-col justify-end text-left transition-all border-2 cursor-pointer shadow-xs",
                        theme.gradient,
                        selectedGradient === theme.id ? "border-slate-900 scale-102" : "border-transparent"
                      )}
                    >
                      <span className="text-[11px] font-bold text-white leading-tight">
                        {theme.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Link Google Drive lưu trữ (Thay thế tệp file cục bộ) */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-slate-900 text-base">
                  2. Link Google Drive / Đám mây lưu trữ tài liệu
                </h2>
              </div>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                Bảo mật cho người mua
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Đường link tệp hoặc thư mục Google Drive <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/1a2b3c4d5e... hoặc link thư mục Drive"
                  className="w-full pl-10 pr-24 py-2.5 border border-slate-200 rounded-[10px] text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {driveUrl && (
                  <a
                    href={driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-[6px] flex items-center gap-1 transition-colors"
                  >
                    Mở thử <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="mt-2 p-3 bg-blue-50/70 border border-blue-100 rounded-[10px] text-xs text-slate-600 leading-relaxed space-y-1">
                <p className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                  Cơ chế lưu trữ và hiển thị trong Trang cá nhân:
                </p>
                <p>
                  • Link Google Drive này sẽ được <strong>bảo mật tuyệt đối</strong> trên trang tài liệu công khai.
                </p>
                <p>
                  • Khi sinh viên mua tài liệu (hoặc tải miễn phí), tài liệu sẽ <strong>tự động xuất hiện trong mục &ldquo;Tài liệu đã mua&rdquo;</strong> trên Trang cá nhân của họ kèm nút bấm mở trực tiếp link Google Drive này.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Thông tin cơ bản & Môn học */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-slate-900 text-base">3. Thông tin cơ bản & Môn học</h2>
              </div>
              <span className="text-xs text-red-500 font-semibold">* Bắt buộc</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Tiêu đề tài liệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Đề cương ôn tập Marketing Căn bản kỳ 1 năm 2024–2025..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:font-normal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Môn học <span className="text-red-500">*</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-400"
                >
                  {allSubjectOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="other">-- Nhập môn học khác --</option>
                </select>

                {subject === "other" && (
                  <input
                    type="text"
                    required
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Nhập tên môn học mới..."
                    className="w-full px-3.5 py-2 mt-2 border border-slate-200 rounded-[8px] text-xs focus:outline-none focus:border-blue-400 font-medium"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Khoa chuyên môn trực thuộc
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-400"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Phân loại tài liệu
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-400"
                >
                  <option value="de-cuong">Đề cương ôn tập</option>
                  <option value="de-thi">Đề thi các năm</option>
                  <option value="slide">Slide bài giảng</option>
                  <option value="giao-trinh">Giáo trình & Sách</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Số trang tài liệu
                </label>
                <input
                  type="number"
                  min="1"
                  value={pages}
                  onChange={(e) => setPages(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-sm text-slate-800 focus:outline-none focus:border-blue-400 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Học kỳ & Năm học
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="Ví dụ: Học kỳ 1 • 2024–2025"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-sm text-slate-800 focus:outline-none focus:border-blue-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Giảng viên / Người biên soạn
                </label>
                <input
                  type="text"
                  value={lecturer}
                  onChange={(e) => setLecturer(e.target.value)}
                  placeholder="Bộ môn / Giảng viên HCE"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-sm text-slate-800 focus:outline-none focus:border-blue-400 font-medium"
                />
              </div>
            </div>

            {/* Phí tài liệu */}
            <div className="p-4 rounded-[14px] bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-bold text-sm text-slate-900 block">Chính sách giá tài liệu</span>
                  <span className="text-xs text-slate-500">
                    Miễn phí hoặc đặt mức giá PRO để sinh viên mua qua VNPAY / MoMo.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPro(false)}
                    className={cn(
                      "px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer",
                      !isPro ? "bg-emerald-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200"
                    )}
                  >
                    Miễn phí (0đ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPro(true)}
                    className={cn(
                      "px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer",
                      isPro ? "bg-amber-500 text-slate-950 shadow-xs" : "bg-white text-slate-600 border border-slate-200"
                    )}
                  >
                    Tài liệu PRO
                  </button>
                </div>
              </div>

              {isPro && (
                <div className="pt-3 border-t border-slate-200/80 flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Giá bán đề xuất (VNĐ)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      min="10000"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-[8px] text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Giá người mua trả:</span>
                    <span className="text-lg font-bold text-blue-600">{formatPrice(price)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Mô tả chi tiết & Điểm trọng tâm */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-slate-900 text-base">4. Nội dung đồng bộ với Mô tả tài liệu</h2>
              </div>
              <span className="text-xs text-blue-600 font-semibold">Đồng bộ Tab Mô tả</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Đoạn tóm tắt tổng quan
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả tóm tắt nội dung tài liệu..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] text-sm text-slate-800 focus:outline-none focus:border-blue-400 leading-relaxed font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Các điểm trọng tâm ôn thi (Gạch đầu dòng nổi bật)
              </label>
              <div className="space-y-2 mb-3">
                {highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 rounded-[8px] border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeHighlightItem(idx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHighlightItem();
                    }
                  }}
                  placeholder="Thêm một điểm trọng tâm ôn thi..."
                  className="flex-1 px-3.5 py-2 border border-slate-200 rounded-[8px] text-xs focus:outline-none focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={addHighlightItem}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-[8px] text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview & Đồng bộ Tài liệu cùng môn */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Live Preview Card */}
            <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Xem trước giao diện Banner & Bìa
              </span>

              {/* Banner Preview */}
              <div
                className={cn(
                  "h-48 rounded-[16px] overflow-hidden relative flex flex-col items-center justify-center p-4 text-center shadow-inner border border-slate-200",
                  coverType === "gradient" || !coverImageUrl ? `bg-gradient-to-br ${currentTheme.gradient}` : "bg-slate-950"
                )}
              >
                {coverImageUrl && coverType !== "gradient" && (
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                )}

                <div className="relative z-10 text-white space-y-1">
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-xs mb-1">
                    {activeSubject || "Môn học"}
                  </div>
                  <h3 className="font-bold text-sm leading-snug line-clamp-2 px-2">
                    {title || "Tiêu đề tài liệu của bạn"}
                  </h3>
                  <p className="text-[11px] text-white/80">
                    Đại học Kinh tế Huế • {pages} trang (Google Drive)
                  </p>
                </div>

                {isPro && (
                  <div className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Lock className="w-3 h-3" /> PRO
                  </div>
                )}
              </div>

              {/* Drive Link Status */}
              <div className="mt-4 p-3 bg-slate-50 rounded-[10px] border border-slate-200 flex items-center gap-2 text-xs">
                <Link2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-800 block">Link Google Drive:</span>
                  <span className="text-slate-500 truncate block">
                    {driveUrl || "Chưa nhập link Drive"}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-[12px] text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                {submitting ? "Đang xuất bản tài liệu..." : "Đăng tài liệu lên hệ thống"}
              </button>
            </div>

            {/* Live Related Docs Preview */}
            <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Tài liệu cùng môn ({relatedDocs.length})
                </span>
                <span className="text-[11px] text-blue-600 font-semibold truncate max-w-[150px]">
                  {activeSubject}
                </span>
              </div>

              {relatedDocs.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {relatedDocs.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center gap-2.5 p-2 rounded-[10px] bg-slate-50 border border-slate-100 text-xs"
                    >
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{d.title}</p>
                        <p className="text-[10px] text-slate-400">{d.pages} trang • {formatPrice(d.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-[12px] text-center border border-dashed border-slate-200">
                  <p className="text-xs font-semibold text-slate-700">Chưa có tài liệu nào khác cùng môn</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function DangTaiLieuPage() {
  return (
    <Suspense fallback={<div className="max-w-[1000px] mx-auto p-12 text-center text-sm text-slate-500">Đang tải biểu mẫu...</div>}>
      <DangTaiLieuForm />
    </Suspense>
  );
}
