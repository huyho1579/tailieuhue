"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { useDocumentStore } from "@/lib/store/documentStore";
import { useLibraryStore } from "@/lib/store/libraryStore";
import { DocumentCard } from "@/components/documents/DocumentCard";

export default function DashboardLibraryPage() {
  const { documents } = useDocumentStore();
  const { isPurchased } = useLibraryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Thư viện tài liệu của tôi</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Danh sách toàn bộ các đề cương, đề thi bạn đã lưu hoặc mở khóa tại ĐH Kinh tế Huế
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const bought = mounted ? isPurchased(doc.id) : false;
          return (
            <div key={doc.id} className="relative flex flex-col">
              {bought && (
                <div className="absolute top-2.5 right-2.5 z-20 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3 h-3" /> Đã sở hữu
                </div>
              )}
              <DocumentCard doc={doc} className="flex-1" />
              {bought && doc.driveUrl && (
                <a
                  href={doc.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-[10px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Mở Google Drive ↗
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
