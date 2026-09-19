"use client";
import { use, useState, useEffect } from "react";
import { FileText, Calendar, Award, ShieldCheck, Mail, Building2, GraduationCap } from "lucide-react";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { PostCard } from "@/components/community/PostCard";
import { useAuthStore } from "@/lib/store/auth";
import { useCommunityStore } from "@/lib/store/communityStore";
import { useDocumentStore } from "@/lib/store/documentStore";
import { cn } from "@/lib/utils/cn";

const TABS = ["Bài viết đã đăng", "Tài liệu đóng góp", "Hoạt động gần đây", "Huy hiệu & Điểm"];

const ACHIEVEMENTS = [
  {
    label: "Thành viên tích cực",
    icon: Award,
    color: "text-blue-700 bg-blue-50 border-blue-200",
    desc: "Tích cực thảo luận và đóng góp tài liệu tại HCE",
  },
  {
    label: "Đóng góp tri thức",
    icon: ShieldCheck,
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    desc: "Chia sẻ tài liệu học tập hữu ích cho cộng đồng",
  },
];

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [activeTab, setActiveTab] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { currentUser, isAdmin } = useAuthStore();
  const { posts } = useCommunityStore();
  const { documents } = useDocumentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Xác định thông tin người dùng đang xem
  const isMe =
    currentUser &&
    (username === currentUser.username ||
      username === "me" ||
      username === currentUser.email.split("@")[0]);

  const profileName = isMe
    ? currentUser.name
    : username === "huyho"
    ? "Hồ Huy"
    : username.replace(/[-_.]/g, " ");

  const profileEmail = isMe
    ? currentUser.email
    : username === "huyho"
    ? "huyho1579@gmail.com"
    : `${username}@hce.edu.vn`;

  const isProfileAdmin = isMe
    ? isAdmin
    : username === "huyho" || profileEmail === "huyho1579@gmail.com";

  const initials = profileName
    ? profileName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SV";

  // Lọc bài viết của người này
  const userPosts = posts.filter(
    (p) =>
      p.author.username === username ||
      p.author.name.toLowerCase() === profileName.toLowerCase() ||
      (isMe && currentUser && p.author.name === currentUser.name)
  );

  // Lọc tài liệu
  const userDocuments = isProfileAdmin ? documents : [];

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-8 mb-8 text-center relative overflow-hidden shadow-xs">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-blue-100/60 to-indigo-100/60" />
        <div className="relative z-10">
          <div className="w-24 h-24 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-3xl mx-auto mb-4 ring-4 ring-white shadow-md">
            {mounted ? initials : "SV"}
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-slate-950">{profileName}</h1>
            {isProfileAdmin ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Quản trị viên (Admin)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                <GraduationCap className="w-3.5 h-3.5" /> Sinh viên HCE
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-0.5">@{username}</p>

          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1 text-blue-700 font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              Đại học Kinh tế Huế
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {profileEmail}
            </span>
          </div>

          {/* Stats thực tế - Không số ảo */}
          <div className="flex items-center justify-center gap-8 mt-6 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-slate-950">{userPosts.length}</div>
              <div className="text-xs text-slate-500 font-medium">bài viết</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-xl font-bold text-slate-950">{userDocuments.length}</div>
              <div className="text-xs text-slate-500 font-medium">tài liệu HCE</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-xl font-bold text-slate-950">0</div>
              <div className="text-xs text-slate-500 font-medium">điểm đóng góp</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Thành viên hoạt động tại EduDocs Huế</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-white border border-slate-200 rounded-[12px] p-1.5 mb-6 overflow-x-auto shadow-xs">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              "flex-1 py-2.5 px-3 text-sm font-semibold rounded-[8px] transition-colors whitespace-nowrap cursor-pointer",
              activeTab === i
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 0 && (
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="bg-white border border-slate-200 rounded-[16px] p-12 text-center text-slate-400">
              <p className="font-semibold text-slate-700">Chưa có bài viết nào</p>
              <p className="text-xs text-slate-500 mt-1">Các bài viết người dùng này đăng tải sẽ hiển thị tại đây.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 1 && (
        <div>
          {userDocuments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userDocuments.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-[16px] p-12 text-center text-slate-400">
              <p className="font-semibold text-slate-700">Chưa có tài liệu nào</p>
              <p className="text-xs text-slate-500 mt-1">Chưa đóng góp tài liệu nào lên hệ thống.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 2 && (
        <div className="space-y-3">
          {[
            {
              text: `Đã kết nối tài khoản sinh viên với hệ thống EduDocs Huế`,
              time: "Gần đây",
            },
            {
              text: "Đã tham gia cộng đồng chia sẻ học tập Đại học Kinh tế Huế",
              time: "Thành viên tích cực",
            },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-[16px] shadow-xs"
            >
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{activity.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.label}
              className={cn("bg-white border rounded-[20px] p-6 text-center shadow-xs", ach.color)}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-white shadow-xs">
                <ach.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base mb-1">{ach.label}</h3>
              <p className="text-xs text-slate-600">{ach.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
