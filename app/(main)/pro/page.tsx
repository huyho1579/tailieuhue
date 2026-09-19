import { Check, Sparkles, BookOpen, Zap, Award } from "lucide-react";
import Link from "next/link";

const FREE_FEATURES = [
  "Tải đề cương và tài liệu miễn phí không giới hạn",
  "Tham gia cộng đồng sinh viên Đại học Kinh tế Huế",
  "Lưu tài liệu yêu thích vào thư viện cá nhân",
  "Đặt câu hỏi và nhận câu trả lời từ bạn cùng trường",
];

const PRO_FEATURES = [
  "Tất cả quyền lợi của gói Miễn phí",
  "Truy cập trọn đời kho tài liệu PRO & đề thi độc quyền HCE",
  "Lời giải đề thi chi tiết và đáp án bài tập lớn",
  "Trải nghiệm học tập sạch sẽ, không quảng cáo",
  "Tính năng AI tóm tắt đề cương và hỗ trợ ôn thi thông minh",
  "Ưu tiên hỗ trợ tài liệu học kỳ gấp",
];

export default function ProPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-16 md:py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, #EFF6FF 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            GÓI TÀI LIỆU PRO — ĐẠI HỌC KINH TẾ HUẾ
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-950 leading-tight mb-4">
            Học thông minh hơn.
            <br />
            <span className="text-blue-600">Ôn thi tự tin qua môn.</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Mở khóa kho đề cương, đề thi tuyển chọn và lời giải chuyên sâu dành riêng cho sinh viên
            Đại học Kinh tế Huế.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Free Card */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-8 flex flex-col shadow-xs">
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                GÓI CƠ BẢN
              </span>
              <div className="text-3xl md:text-4xl font-bold text-slate-950 mt-2">0 đồng</div>
              <p className="text-slate-500 text-sm mt-1">Dành cho mọi sinh viên HCE</p>
            </div>

            <Link
              href="/register"
              className="block w-full py-3 text-center border-2 border-slate-200 text-slate-700 font-bold rounded-[10px] hover:border-blue-300 hover:text-blue-600 transition-colors text-sm mb-6"
            >
              Đăng ký tài khoản miễn phí
            </Link>

            <ul className="space-y-3 mt-auto">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PRO Card */}
          <div className="relative bg-blue-600 rounded-[20px] p-8 text-white flex flex-col overflow-hidden shadow-lg shadow-blue-600/20">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full opacity-30 pointer-events-none" />
            <div className="absolute -right-4 -bottom-12 w-32 h-32 bg-blue-700 rounded-full opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                    GÓI NÂNG CAO (PRO)
                  </span>
                  <div className="text-3xl md:text-4xl font-bold text-white mt-2">79.000đ</div>
                  <p className="text-blue-100 text-xs mt-1">mỗi tháng • hủy bất kỳ lúc nào</p>
                </div>
                <div className="bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  Phổ biến nhất
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-3 text-center bg-white text-blue-600 font-bold rounded-[10px] hover:bg-blue-50 transition-colors text-sm mb-6 shadow-md"
              >
                Nâng cấp tài khoản PRO ngay
              </Link>

              <ul className="space-y-3 mt-auto">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-blue-50">
                    <Check className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose PRO */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-950 text-center mb-10">
            Tại sao sinh viên Kinh tế Huế chọn PRO?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Chuẩn khung đề cương HCE",
                desc: "Nội dung bám sát từng học phần của Đại học Kinh tế Huế, do các sinh viên giỏi và giảng viên trợ giảng tổng hợp.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Zap,
                title: "Giải đề thi chi tiết",
                desc: "Không chỉ có đề thi, gói PRO cung cấp bài giải mẫu từng bước giúp bạn hiểu bản chất và đạt điểm cao.",
                color: "bg-purple-50 text-purple-600",
              },
              {
                icon: Award,
                title: "Tiết kiệm thời gian ôn thi",
                desc: "Tổng hợp cô đọng toàn bộ kiến thức 15 tuần học chỉ trong 20-30 trang đề cương trọng tâm.",
                color: "bg-emerald-50 text-emerald-600",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="bg-white border border-slate-200 rounded-[20px] p-6 text-center shadow-xs"
              >
                <div
                  className={`w-12 h-12 rounded-[12px] flex items-center justify-center mx-auto mb-4 ${feat.color}`}
                >
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
