"use client";
import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, Lock, CreditCard, Smartphone, Check, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDocumentStore } from "@/lib/store/documentStore";
import { useLibraryStore } from "@/lib/store/libraryStore";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const PAYMENT_METHODS = [
  { id: "vnpay", label: "Cổng thanh toán VNPAY (Thẻ ATM, QR Pay)", icon: CreditCard },
  { id: "momo", label: "Ví điện tử MoMo", icon: Smartphone },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const docId = searchParams.get("docId");

  const { documents } = useDocumentStore();
  const { purchaseDocument } = useLibraryStore();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [method, setMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Tìm tài liệu theo docId hoặc fallback tài liệu PRO đầu tiên
  const doc = useMemo(() => {
    if (docId) {
      const found = documents.find((d) => d.id === docId);
      if (found) return found;
    }
    return documents.find((d) => d.isPro) || documents[0];
  }, [docId, documents]);

  const targetDriveUrl = doc?.driveUrl || "https://drive.google.com/drive/folders/edudocs-hce";

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      // Tự động lưu tài liệu vào danh sách đã mua trong Trang cá nhân
      if (doc) {
        purchaseDocument(doc);
        addNotification({
          title: "Mua tài liệu thành công",
          message: `Bạn đã mua thành công tài liệu "${doc.title}". Kiểm tra trong mục Đã mua.`,
          type: "purchase",
        });
      }
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  if (success && doc) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-950 mb-2">Thanh toán thành công!</h1>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Tài liệu <strong className="text-slate-900">&ldquo;{doc.title}&rdquo;</strong> đã được mở khóa và lưu vĩnh viễn vào mục <strong>&ldquo;Tài liệu đã mua&rdquo;</strong> trong trang cá nhân của bạn.
        </p>

        {/* NÚT MỞ LINK GOOGLE DRIVE NGAY */}
        <div className="bg-blue-50 border border-blue-200 rounded-[20px] p-6 mb-6 text-left space-y-3">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
            Link truy cập Google Drive của bạn:
          </span>
          <div className="p-3 bg-white rounded-[10px] border border-blue-100 text-xs font-mono text-slate-700 truncate">
            {targetDriveUrl}
          </div>
          <a
            href={targetDriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[12px] transition-colors text-sm shadow-md cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            Mở Link Google Drive ngay ↗
          </a>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/dashboard/da-mua"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-[12px] transition-colors text-sm"
          >
            Xem danh sách Tài liệu đã mua trong Trang cá nhân
          </Link>
          <Link
            href={`/tai-lieu/${doc.slug}`}
            className="w-full py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-[10px] hover:bg-slate-50 transition-colors text-xs"
          >
            Quay lại trang tài liệu
          </Link>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="max-w-md mx-auto py-20 text-center text-slate-500">
        Không tìm thấy tài liệu cần thanh toán.
      </div>
    );
  }

  return (
    <div className="max-w-[920px] mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-950 mb-1">Thanh toán tài liệu</h1>
      <p className="text-slate-500 text-sm mb-8">
        Sau khi thanh toán, tài liệu sẽ tự động lưu vào Trang cá nhân kèm Link Google Drive đầy đủ.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Left: Payment method */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs">
            <h2 className="font-bold text-slate-900 mb-4 text-base">
              Chọn phương thức thanh toán
            </h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setMethod(pm.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 border rounded-[12px] text-left transition-colors cursor-pointer",
                    method === pm.id
                      ? "border-blue-500 bg-blue-50/60"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0",
                      method === pm.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <pm.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      "font-semibold text-sm",
                      method === pm.id ? "text-blue-900" : "text-slate-700"
                    )}
                  >
                    {pm.label}
                  </span>
                  {method === pm.id && (
                    <div className="ml-auto w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 p-3 bg-slate-50 rounded-[10px] border border-slate-200">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thanh toán bảo mật chuẩn mã hóa SSL 256-bit. Nhận link Drive ngay tức thì.</span>
          </div>
        </div>

        {/* Right: Order summary */}
        <div>
          <div className="bg-white border border-slate-200 rounded-[20px] p-6 sticky top-24 shadow-xs">
            <h2 className="font-bold text-slate-900 mb-5 text-base">Thông tin đơn hàng</h2>

            <div className="flex gap-3 p-3 bg-slate-50 rounded-[12px] mb-5 border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-[8px] flex items-center justify-center shrink-0">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{doc.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  ĐH Kinh tế Huế • {doc.pages} trang (Google Drive)
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-sm mb-5">
              <div className="flex justify-between text-slate-600">
                <span>Giá tài liệu PRO:</span>
                <span className="font-semibold text-slate-900">{formatPrice(doc.price)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí xử lý giao dịch:</span>
                <span className="text-emerald-600 font-semibold">Miễn phí</span>
              </div>
              <div className="flex justify-between font-bold text-slate-950 pt-3 border-t border-slate-100 text-base">
                <span>Tổng thanh toán:</span>
                <span className="text-blue-600">{formatPrice(doc.price)}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold rounded-[10px] transition-colors text-sm cursor-pointer shadow-xs"
            >
              {loading ? "Đang xử lý thanh toán..." : `Xác nhận thanh toán ${formatPrice(doc.price)}`}
            </button>

            <p className="text-xs text-slate-400 text-center mt-3.5 leading-relaxed">
              Sau khi thanh toán thành công, bạn sẽ nhận được link Google Drive xem và tải về trọn đời.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[920px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải thông tin đơn hàng...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
