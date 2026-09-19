import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "TailieuHue — Nền tảng tài liệu Đại học Kinh tế Huế",
  description: "Kết nối tri thức — Cùng bạn học tốt hơn. Kho đề cương, đề thi, slide và tài liệu học tập chính thức cho sinh viên ĐH Kinh tế Huế (HCE).",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "TailieuHue — Kết nối tri thức, Cùng bạn học tốt hơn",
    description: "Kho đề cương, đề thi, slide và tài liệu học tập chính thức cho sinh viên Đại học Kinh tế Huế.",
    images: [{ url: "/banner.png", width: 1200, height: 400, alt: "TailieuHue" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <MobileNav />
        {/* Bottom padding for mobile nav */}
        <div className="md:hidden h-16" />
      </body>
    </html>
  );
}
