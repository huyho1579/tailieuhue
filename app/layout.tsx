import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "EduDocs — Nền tảng tài liệu học tập cho sinh viên",
  description: "Kho đề cương, đề thi, slide và tài liệu học tập dành cho sinh viên Việt Nam. Học đúng tài liệu, ôn đúng trọng tâm.",
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
