"use client";
import { useMemo } from "react";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedDocs } from "@/components/home/FeaturedDocs";
import { CommunityPreview } from "@/components/home/CommunityPreview";
import { ProBanner } from "@/components/home/ProBanner";
import { useDocumentStore } from "@/lib/store/documentStore";

export default function HomePage() {
  const { documents } = useDocumentStore();

  const deCuongDocs = useMemo(
    () => documents.filter((d) => d.type === "de-cuong").slice(0, 4),
    [documents]
  );

  const deThiDocs = useMemo(
    () => documents.filter((d) => d.type === "de-thi" || d.isPro).slice(0, 4),
    [documents]
  );

  return (
    <div className="animate-fade-in">
      <Hero />
      <CategoryGrid />
      <FeaturedDocs
        title="Đề cương ôn thi trọng tâm"
        docs={deCuongDocs}
        viewAllHref="/tai-lieu/de-cuong"
      />
      <FeaturedDocs
        title="Đề thi & Tài liệu nâng cao"
        docs={deThiDocs}
        viewAllHref="/tai-lieu"
      />
      <CommunityPreview />
      <ProBanner />
    </div>
  );
}
