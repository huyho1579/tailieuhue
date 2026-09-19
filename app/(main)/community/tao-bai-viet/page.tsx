"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bold, Italic, Underline, Link2, Image, Tag, X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/lib/store/auth";
import { useCommunityStore } from "@/lib/store/communityStore";

const POST_TYPES = [
  { id: "discussion", label: "Thảo luận môn học" },
  { id: "qa", label: "Hỏi đáp & Thắc mắc" },
  { id: "share", label: "Chia sẻ tài liệu / Đề thi" },
  { id: "experience", label: "Kinh nghiệm thi cử & Học tập" },
];

const SUGGESTED_TAGS = [
  "marketing",
  "kinh-te-vi-mo",
  "ke-toan-tai-chinh",
  "quan-tri-hoc",
  "on-thi-cuoi-ky",
  "kinh-te-hue",
  "hce",
];

export default function CreatePostPage() {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { addPost } = useCommunityStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("discussion");
  const [tags, setTags] = useState<string[]>(["kinh-te-hue"]);
  const [tagInput, setTagInput] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addTag = (tag: string) => {
    const cleaned = tag.trim().toLowerCase().replace(/\s+/g, "-");
    if (cleaned && !tags.includes(cleaned) && tags.length < 5) {
      setTags([...tags, cleaned]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSubmit = (isDraft = false) => {
    if (!title.trim() || !content.trim()) return;
    setSubmitted(true);

    const authorName = currentUser?.name || "Sinh viên HCE";
    const authorUsername =
      currentUser?.username ||
      (currentUser?.email ? currentUser.email.split("@")[0] : "sinhvien");
    const authorAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      authorName
    )}`;

    const newPost = addPost({
      title: title.trim(),
      content: content.trim(),
      type: postType as "discussion" | "qa" | "share" | "experience",
      author: {
        name: authorName,
        username: authorUsername,
        avatar: authorAvatar,
      },
      tags: tags.length > 0 ? tags : ["kinh-te-hue"],
      authorEmail: currentUser?.email || `${authorUsername}@tailieuhue.com`,
    });

    setTimeout(() => {
      router.push(`/community/${newPost.slug}`);
    }, 500);
  };

  const selectedType = POST_TYPES.find((t) => t.id === postType)!;

  return (
    <div className="max-w-[820px] mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-2">
          Đại học Kinh tế Huế
        </div>
        <h1 className="text-2xl font-bold text-slate-950">Tạo bài viết & Chia sẻ mới</h1>
        <p className="text-slate-500 text-sm mt-1">
          Đóng góp tài liệu, đặt câu hỏi hoặc chia sẻ kinh nghiệm học tập cho các bạn sinh viên HCE
        </p>
      </div>

      <div className="space-y-6 bg-white border border-slate-200 rounded-[20px] p-6 md:p-8 shadow-xs">
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Tiêu đề bài viết <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Cần xin đề cương môn Marketing căn bản kỳ 1 năm 2024..."
            maxLength={120}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[10px] text-slate-900 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <p className="text-xs text-slate-400 mt-1.5 text-right">{title.length}/120 ký tự</p>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Thể loại bài đăng
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setTypeOpen(!typeOpen)}
              className="w-full sm:w-auto flex items-center justify-between gap-4 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-sm font-semibold text-slate-800 hover:border-blue-300 transition-colors"
            >
              <span>{selectedType.label}</span>
              <ChevronDown
                className={cn("w-4 h-4 text-slate-400 transition-transform", typeOpen && "rotate-180")}
              />
            </button>
            {typeOpen && (
              <div className="absolute top-full mt-1.5 left-0 bg-white border border-slate-200 rounded-[10px] shadow-lg z-10 min-w-[240px] overflow-hidden">
                {POST_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setPostType(t.id);
                      setTypeOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer",
                      t.id === postType
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Nội dung chi tiết <span className="text-red-500">*</span>
          </label>
          <div className="border border-slate-200 rounded-[10px] overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50">
              {[
                { icon: Bold, label: "Đậm" },
                { icon: Italic, label: "Nghiêng" },
                { icon: Underline, label: "Gạch chân" },
                { icon: Link2, label: "Đính kèm liên kết" },
                { icon: Image, label: "Chèn ảnh" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  title={label}
                  className="w-8 h-8 flex items-center justify-center rounded-[6px] text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Trình bày nội dung câu hỏi, tóm tắt tài liệu hoặc hướng dẫn chi tiết..."
              rows={8}
              className="w-full px-4 py-3 text-slate-900 text-sm leading-relaxed resize-none focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Thẻ môn học (Tags){" "}
            <span className="font-normal text-slate-400 text-xs">(tối đa 5 thẻ)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-full"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-400 hover:text-blue-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder="Nhập thẻ rồi nhấn Enter..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                disabled={tags.length >= 5}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="text-xs text-slate-400 self-center mr-1">Gợi ý:</span>
            {SUGGESTED_TAGS.filter((t) => !tags.includes(t))
              .slice(0, 5)
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  disabled={tags.length >= 5}
                  className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-40"
                >
                  +{tag}
                </button>
              ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="px-5 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-[10px] hover:border-slate-300 transition-colors"
          >
            Lưu bản nháp
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!title.trim() || !content.trim() || submitted}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-[10px] transition-colors shadow-xs"
          >
            {submitted ? "Đang đăng bài..." : "Đăng bài ngay"}
          </button>
        </div>
      </div>
    </div>
  );
}
