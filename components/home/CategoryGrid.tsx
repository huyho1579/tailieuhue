import Link from "next/link";
import {
  BookOpen, FileText, Presentation, BookMarked,
  Code, TrendingUp, Megaphone, Scale
} from "lucide-react";
import { CATEGORIES } from "@/lib/data/mock";

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen, FileText, Presentation, BookMarked,
  Code, TrendingUp, Megaphone, Scale,
};

const COLOR_MAP = [
  { bg: "#EFF6FF", text: "#2563EB" },
  { bg: "#F5F3FF", text: "#7C3AED" },
  { bg: "#ECFDF5", text: "#16A34A" },
  { bg: "#FFF7ED", text: "#EA580C" },
  { bg: "#ECFEFF", text: "#0891B2" },
  { bg: "#FFF1F2", text: "#E11D48" },
  { bg: "#FFFBEB", text: "#D97706" },
  { bg: "#EEF2FF", text: "#4F46E5" },
];

export function CategoryGrid() {
  return (
    <section style={{ padding: "48px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#0F172A",
            marginBottom: "24px",
          }}
        >
          Khám phá theo danh mục
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
          }}
          className="sm:grid-cols-4 lg:grid-cols-8"
        >
          {CATEGORIES.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon] || BookOpen;
            const color = COLOR_MAP[i % COLOR_MAP.length];
            return (
              <Link
                key={cat.id}
                href={`/tai-lieu/${cat.id}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 8px",
                  background: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: "16px",
                  textDecoration: "none",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
                className="hover:border-blue-200 hover:shadow-md"
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: color.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon style={{ width: "20px", height: "20px", color: color.text }} />
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#1E293B", lineHeight: 1.3 }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>
                    {cat.count > 0 ? `${cat.count} tài liệu` : "ĐH Kinh tế Huế"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
