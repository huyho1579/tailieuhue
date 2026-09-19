"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { PostCard } from "@/components/community/PostCard";
import { SkeletonCard } from "@/components/shared/Skeleton";
import { mockDocuments, mockPosts } from "@/lib/data/mock";
import { cn } from "@/lib/utils/cn";

const RESULT_TABS = ["Tất cả kết quả", "Tài liệu học tập", "Bài viết cộng đồng"];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const matchedDocs = mockDocuments.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.subject.toLowerCase().includes(search.toLowerCase()) ||
      d.university.toLowerCase().includes(search.toLowerCase())
  );

  const matchedPosts = mockPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (q: string) => {
    setSearch(q);
    setLoading(true);
    setTimeout(() => setLoading(false), 200);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 animate-fade-in">
      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm kiếm đề cương, môn học, bài viết tại ĐH Kinh tế Huế..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[12px] text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-all"
          />
        </div>
      </div>

      {/* Results info */}
      {search && (
        <div className="text-center mb-8">
          <p className="text-slate-500 text-sm">
            Tìm thấy{" "}
            <span className="font-bold text-slate-900">
              {matchedDocs.length + matchedPosts.length}
            </span>{" "}
            kết quả cho từ khóa{" "}
            <span className="font-bold text-blue-600">&ldquo;{search}&rdquo;</span>
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {RESULT_TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              "px-4 py-2 rounded-[10px] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap",
              activeTab === i
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200"
            )}
          >
            {tab}
            {i === 1 && matchedDocs.length > 0 && (
              <span className="ml-2 text-xs opacity-80">({matchedDocs.length})</span>
            )}
            {i === 2 && matchedPosts.length > 0 && (
              <span className="ml-2 text-xs opacity-80">({matchedPosts.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Results */}
      {!search ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-[20px] border border-slate-200">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30 text-blue-600" />
          <p className="text-base font-bold text-slate-700">Nhập từ khóa để tìm kiếm tài liệu</p>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu đề cương, đề thi, slide môn học của Đại học Kinh tế Huế
          </p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {(activeTab === 0 || activeTab === 1) && matchedDocs.length > 0 && (
            <div className="mb-8">
              {activeTab === 0 && (
                <h2 className="font-bold mb-4 text-xs uppercase tracking-wider text-slate-500">
                  Tài liệu học tập ({matchedDocs.length})
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedDocs.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          )}

          {(activeTab === 0 || activeTab === 2) && matchedPosts.length > 0 && (
            <div>
              {activeTab === 0 && (
                <h2 className="font-bold mb-4 text-xs uppercase tracking-wider text-slate-500">
                  Bài viết cộng đồng ({matchedPosts.length})
                </h2>
              )}
              <div className="space-y-4">
                {matchedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {matchedDocs.length === 0 && matchedPosts.length === 0 && (
            <div className="text-center py-20 text-slate-400 bg-white rounded-[20px] border border-slate-200">
              <p className="text-base font-bold text-slate-800">Không tìm thấy kết quả nào phù hợp</p>
              <p className="text-xs text-slate-500 mt-1">
                Thử tìm với tên môn học không dấu hoặc từ khóa ngắn hơn
              </p>
              <Link
                href="/community/tao-bai-viet"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-[8px]"
              >
                <Plus className="w-4 h-4" />
                Đặt câu hỏi nhờ bạn cùng trường trợ giúp
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="h-14 bg-slate-100 rounded-[12px] animate-skeleton" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
