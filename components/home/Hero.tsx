import { SearchBar } from "@/components/shared/SearchBar";
import { BookOpen, GraduationCap, Building2 } from "lucide-react";
import { mockDocuments } from "@/lib/data/mock";

export function Hero() {
  const docCount = mockDocuments.length;
  const subjectCount = new Set(mockDocuments.map((d) => d.subject)).size;

  const STATS = [
    { value: `${docCount}`, label: "tài liệu đã đăng", icon: BookOpen },
    { value: `${subjectCount}`, label: "môn học trọng tâm", icon: GraduationCap },
    { value: "ĐH Kinh tế Huế", label: "trường trọng điểm", icon: Building2 },
  ];

  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ textAlign: "center" }}
    >
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, #EFF6FF 0%, transparent 70%)",
        }}
      />

      <div
        className="relative px-4"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        {/* Trường Đại học Kinh tế Huế badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: "9999px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#1D4ED8",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#2563EB",
              display: "inline-block",
            }}
          />
          Cộng đồng học tập Đại học Kinh tế Huế (HCE)
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "#0F172A",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}
        >
          Học đúng tài liệu.
          <br />
          <span style={{ color: "#2563EB" }}>Ôn đúng trọng tâm.</span>
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "1.0625rem",
            marginBottom: "32px",
            maxWidth: "560px",
            margin: "0 auto 32px auto",
            lineHeight: 1.7,
          }}
        >
          Kho đề cương, đề thi và bài giảng chuyên sâu dành riêng cho sinh viên{" "}
          <strong className="text-slate-800 font-semibold">Đại học Kinh tế — Đại học Huế</strong>.
        </p>

        {/* Search */}
        <div
          style={{
            maxWidth: "540px",
            margin: "0 auto 40px auto",
          }}
        >
          <SearchBar
            placeholder="Tìm đề cương, môn học (Marketing, Vi mô, Kế toán...)"
            size="lg"
          />
        </div>

        {/* Real Stats - Không số ảo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "36px",
            flexWrap: "wrap",
          }}
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "10px 20px",
                background: "rgba(255, 255, 255, 0.7)",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                minWidth: "150px",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#0F172A",
                }}
              >
                {stat.value}
              </span>
              <span style={{ fontSize: "13px", color: "#64748B" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
