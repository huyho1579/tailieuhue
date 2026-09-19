"use client";
import { useState, useEffect } from "react";
import { Clock, Flame } from "lucide-react";

export function StudyTimer() {
  const [minutes, setMinutes] = useState(52);
  const [streak, setStreak] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lấy thời gian học tập đã lưu hôm nay
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("tailieuhue-study-date");
    const savedMinutes = localStorage.getItem("tailieuhue-study-minutes");
    const savedStreak = localStorage.getItem("tailieuhue-study-streak");

    let initialMinutes = 52;
    if (savedDate === today && savedMinutes) {
      initialMinutes = parseInt(savedMinutes, 10);
    } else {
      localStorage.setItem("tailieuhue-study-date", today);
      localStorage.setItem("tailieuhue-study-minutes", "52");
    }

    setMinutes(initialMinutes);
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }

    // Tự động tăng 1 phút sau mỗi 60 giây hoạt động
    const interval = setInterval(() => {
      setMinutes((prev) => {
        const next = prev + 1;
        localStorage.setItem("tailieuhue-study-minutes", next.toString());
        return next;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 animate-pulse">
        <div className="h-7 w-14 bg-slate-100 dark:bg-slate-800 rounded-full" />
        <div className="h-7 w-10 bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>
    );
  }

  const formatStudyTime = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="hidden sm:flex items-center gap-1.5 select-none">
      {/* Time pill */}
      <div
        title="Thời gian bạn đã học tập và hoạt động trên TailieuHue hôm nay"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold shadow-2xs transition-all hover:scale-102"
      >
        <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>{formatStudyTime(minutes)}</span>
      </div>

      {/* Streak pill */}
      <div
        title="Chuỗi ngày chăm chỉ học tập liên tiếp"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-2xs transition-all hover:scale-102"
      >
        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
        <span>{streak}</span>
      </div>
    </div>
  );
}
