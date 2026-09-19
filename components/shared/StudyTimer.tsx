"use client";
import { useState, useEffect, useRef } from "react";
import { Clock, Flame, Calendar, Sparkles } from "lucide-react";

export function StudyTimer() {
  const [seconds, setSeconds] = useState(0);
  const [streak, setStreak] = useState(1);
  const [clockTime, setClockTime] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // 1. Cập nhật đồng hồ thời gian thực (Giờ thực tế)
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setClockTime(`${h}:${m}:${s}`);
    };
    updateClock();

    // 2. Lấy thời gian hoạt động thực tế đã lưu hôm nay (tính theo giây)
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("tailieuhue-study-date");
    const savedSecondsStr = localStorage.getItem("tailieuhue-study-seconds");
    const savedStreakStr = localStorage.getItem("tailieuhue-study-streak");

    let initialSeconds = 0;
    if (savedDate === today && savedSecondsStr) {
      initialSeconds = parseInt(savedSecondsStr, 10) || 0;
    } else {
      localStorage.setItem("tailieuhue-study-date", today);
      localStorage.setItem("tailieuhue-study-seconds", "0");
    }

    setSeconds(initialSeconds);
    if (savedStreakStr) {
      setStreak(parseInt(savedStreakStr, 10) || 1);
    } else {
      localStorage.setItem("tailieuhue-study-streak", "1");
    }

    // 3. Đếm thời gian thực tế mỗi giây khi người dùng đang mở tab
    let accumulated = initialSeconds;
    const interval = setInterval(() => {
      updateClock();

      if (document.visibilityState === "visible") {
        accumulated += 1;
        setSeconds(accumulated);

        // Lưu định kỳ mỗi 5 giây
        if (accumulated % 5 === 0) {
          localStorage.setItem("tailieuhue-study-seconds", accumulated.toString());
        }
      }
    }, 1000);

    // Đóng dropdown khi click ra ngoài
    const handleClickOutside = (e: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        setShowDetails(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 animate-pulse">
        <div className="h-7 w-14 bg-slate-100 dark:bg-slate-800 rounded-full" />
        <div className="h-7 w-10 bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>
    );
  }

  const minutes = Math.floor(seconds / 60);

  const formatStudyTime = (mins: number) => {
    if (mins < 1) return `${seconds}s`;
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const formatDetailTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s} giây`;
    return `${m} phút ${s} giây`;
  };

  return (
    <div className="relative hidden sm:flex items-center gap-1.5 select-none" ref={detailsRef}>
      {/* Time pill */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        title={`Thời gian hoạt động thực tế: ${formatDetailTime(seconds)} (Nhấn xem đồng hồ)`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold shadow-2xs transition-all hover:scale-102 cursor-pointer"
      >
        <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>{formatStudyTime(minutes)}</span>
      </button>

      {/* Streak pill */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        title="Chuỗi ngày chăm chỉ học tập liên tiếp"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-2xs transition-all hover:scale-102 cursor-pointer"
      >
        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
        <span>{streak}</span>
      </button>

      {/* Details Popover */}
      {showDetails && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[16px] p-4 shadow-xl z-50 animate-fade-in text-xs">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Thời gian thực & Học tập
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              Live
            </span>
          </div>

          <div className="space-y-2.5 text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Đồng hồ thực tế:
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {clockTime}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Hoạt động hôm nay:
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {formatDetailTime(seconds)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Chuỗi ngày chăm chỉ:
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {streak} ngày liên tiếp
              </span>
            </div>
          </div>

          <p className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
            Thời gian tự động đếm từng giây khi bạn mở web
          </p>
        </div>
      )}
    </div>
  );
}
