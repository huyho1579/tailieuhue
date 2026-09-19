export type Document = {
  id: string;
  title: string;
  slug: string;
  subject: string;
  university: string;
  type: "de-cuong" | "de-thi" | "slide" | "giao-trinh";
  isPro: boolean;
  price: number;
  rating: number;
  reviewCount: number;
  viewCount: number;
  downloadCount: number;
  thumbnail: string;
  description: string;
  pages: number;
  uploadedAt: Date;
  author: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  type: "discussion" | "qa" | "share" | "experience";
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  bookmarks: number;
  createdAt: Date;
  tags: string[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "admin" | "user";
  university: string;
  points: number;
  isPro: boolean;
};

// ─── Admin & Users ───────────────────────────────────────────
export const ADMIN_EMAIL = "huyho1579@gmail.com";

export const mockUsers: User[] = [
  {
    id: "admin-1",
    name: "Hồ Huy",
    email: "huyho1579@gmail.com",
    username: "huyho",
    role: "admin",
    university: "Đại học Kinh tế Huế",
    points: 0,
    isPro: true,
  },
];

// ─── Documents ───────────────────────────────────────────────
export const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Đề cương Marketing Căn bản",
    slug: "de-cuong-marketing-can-ban",
    subject: "Marketing Căn bản",
    university: "Đại học Kinh tế Huế",
    type: "de-cuong",
    isPro: false,
    price: 0,
    rating: 0,
    reviewCount: 0,
    viewCount: 0,
    downloadCount: 0,
    thumbnail: "",
    description: "Đề cương tổng hợp môn Marketing Căn bản dành cho sinh viên Đại học Kinh tế Huế. Bao gồm toàn bộ lý thuyết trọng tâm, các khái niệm cơ bản và hướng dẫn ôn thi cuối kỳ.",
    pages: 24,
    uploadedAt: new Date("2024-10-10"),
    author: "Hồ Huy",
  },
  {
    id: "2",
    title: "Đề cương Kế toán Tài chính",
    slug: "de-cuong-ke-toan-tai-chinh",
    subject: "Kế toán Tài chính",
    university: "Đại học Kinh tế Huế",
    type: "de-cuong",
    isPro: true,
    price: 29000,
    rating: 0,
    reviewCount: 0,
    viewCount: 0,
    downloadCount: 0,
    thumbnail: "",
    description: "Tổng hợp toàn bộ kiến thức Kế toán Tài chính. Nội dung bao gồm các nguyên tắc kế toán, phương pháp ghi nhận nghiệp vụ, lập báo cáo tài chính theo chuẩn mực kế toán Việt Nam.",
    pages: 36,
    uploadedAt: new Date("2024-11-05"),
    author: "Hồ Huy",
  },
  {
    id: "3",
    title: "Đề thi Kinh tế Vi mô — Các năm 2022–2024",
    slug: "de-thi-kinh-te-vi-mo",
    subject: "Kinh tế Vi mô",
    university: "Đại học Kinh tế Huế",
    type: "de-thi",
    isPro: true,
    price: 39000,
    rating: 0,
    reviewCount: 0,
    viewCount: 0,
    downloadCount: 0,
    thumbnail: "",
    description: "Bộ đề thi môn Kinh tế Vi mô từ năm 2022 đến 2024 của Đại học Kinh tế Huế, kèm theo đáp án và hướng dẫn giải chi tiết.",
    pages: 48,
    uploadedAt: new Date("2024-09-20"),
    author: "Hồ Huy",
  },
  {
    id: "4",
    title: "Slide Bài giảng Quản trị Học",
    slug: "slide-quan-tri-hoc",
    subject: "Quản trị Học",
    university: "Đại học Kinh tế Huế",
    type: "slide",
    isPro: false,
    price: 0,
    rating: 0,
    reviewCount: 0,
    viewCount: 0,
    downloadCount: 0,
    thumbnail: "",
    description: "Slide bài giảng đầy đủ môn Quản trị Học dành cho sinh viên Đại học Kinh tế Huế. Bao gồm các chương về chức năng quản trị, lập kế hoạch, tổ chức, lãnh đạo và kiểm soát.",
    pages: 95,
    uploadedAt: new Date("2024-08-15"),
    author: "Hồ Huy",
  },
  {
    id: "5",
    title: "Đề cương Kinh tế Vĩ mô",
    slug: "de-cuong-kinh-te-vi-mo-2",
    subject: "Kinh tế Vĩ mô",
    university: "Đại học Kinh tế Huế",
    type: "de-cuong",
    isPro: false,
    price: 0,
    rating: 0,
    reviewCount: 0,
    viewCount: 0,
    downloadCount: 0,
    thumbnail: "",
    description: "Đề cương ôn tập môn Kinh tế Vĩ mô bao gồm lý thuyết tổng cầu, tổng cung, chính sách tài khoá, chính sách tiền tệ và các mô hình kinh tế vĩ mô cơ bản.",
    pages: 30,
    uploadedAt: new Date("2024-07-01"),
    author: "Hồ Huy",
  },
  {
    id: "6",
    title: "Đề cương Quản trị Nhân lực",
    slug: "de-cuong-quan-tri-nhan-luc",
    subject: "Quản trị Nhân lực",
    university: "Đại học Kinh tế Huế",
    type: "de-cuong",
    isPro: true,
    price: 29000,
    rating: 0,
    reviewCount: 0,
    viewCount: 0,
    downloadCount: 0,
    thumbnail: "",
    description: "Tổng hợp lý thuyết Quản trị Nhân lực theo chương trình của Đại học Kinh tế Huế: tuyển dụng, đào tạo, đánh giá hiệu suất, lương thưởng và quan hệ lao động.",
    pages: 28,
    uploadedAt: new Date("2024-11-20"),
    author: "Hồ Huy",
  },
  {
    id: "7",
    title: "Đề cương Luật Kinh doanh",
    slug: "de-cuong-luat-kinh-doanh",
    subject: "Luật Kinh doanh",
    university: "Đại học Kinh tế Huế",
    type: "de-cuong",
    isPro: false,
    price: 0,
    rating: 0,
    reviewCount: 0,
    viewCount: 0,
    downloadCount: 0,
    thumbnail: "",
    description: "Đề cương Luật Kinh doanh tổng hợp các quy định về doanh nghiệp, hợp đồng kinh tế, pháp luật lao động và các vấn đề pháp lý trong hoạt động kinh doanh.",
    pages: 20,
    uploadedAt: new Date("2024-10-25"),
    author: "Hồ Huy",
  },
  {
    id: "8",
    title: "Giáo trình Tài chính Doanh nghiệp",
    slug: "giao-trinh-tai-chinh-doanh-nghiep",
    subject: "Tài chính Doanh nghiệp",
    university: "Đại học Kinh tế Huế",
    type: "giao-trinh",
    isPro: true,
    price: 49000,
    rating: 0,
    reviewCount: 0,
    viewCount: 0,
    downloadCount: 0,
    thumbnail: "",
    description: "Giáo trình Tài chính Doanh nghiệp dành riêng cho sinh viên Đại học Kinh tế Huế. Nội dung bao gồm phân tích tài chính, quyết định đầu tư, cấu trúc vốn và quản trị rủi ro.",
    pages: 120,
    uploadedAt: new Date("2024-12-01"),
    author: "Hồ Huy",
  },
];

// ─── Community Posts ──────────────────────────────────────────
export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Marketing Căn bản nên học phần nào trước khi thi?",
    slug: "marketing-can-ban-nen-hoc-phan-nao",
    excerpt: "Mình đang chuẩn bị thi cuối kỳ Marketing Căn bản tại Đại học Kinh tế Huế nhưng không biết nên ưu tiên ôn phần nào trước. Mọi người cho mình lời khuyên với ạ.",
    content: "Mình đang chuẩn bị thi cuối kỳ Marketing Căn bản tại Đại học Kinh tế Huế nhưng không biết nên ưu tiên ôn phần nào trước. Mọi người cho mình lời khuyên với ạ.",
    type: "qa",
    author: { name: "Hồ Huy", username: "huyho", avatar: "" },
    likes: 0,
    comments: 0,
    bookmarks: 0,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    tags: ["marketing", "on-thi", "kinh-te-hue"],
  },
  {
    id: "2",
    title: "Kinh nghiệm ôn thi Kế toán Tài chính tại ĐH Kinh tế Huế",
    slug: "kinh-nghiem-on-thi-ke-toan-tai-chinh",
    excerpt: "Mình vừa thi xong Kế toán Tài chính và muốn chia sẻ kinh nghiệm ôn tập với các bạn sinh viên Đại học Kinh tế Huế. Tập trung vào phần ghi nhận nghiệp vụ và lập báo cáo.",
    content: "Mình vừa thi xong Kế toán Tài chính và muốn chia sẻ kinh nghiệm ôn tập với các bạn sinh viên Đại học Kinh tế Huế. Tập trung vào phần ghi nhận nghiệp vụ và lập báo cáo.",
    type: "experience",
    author: { name: "Hồ Huy", username: "huyho", avatar: "" },
    likes: 0,
    comments: 0,
    bookmarks: 0,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    tags: ["ke-toan", "kinh-nghiem", "kinh-te-hue"],
  },
  {
    id: "3",
    title: "Thảo luận: Phương pháp học Kinh tế Vi mô hiệu quả",
    slug: "phuong-phap-hoc-kinh-te-vi-mo",
    excerpt: "Mọi người thường dùng phương pháp gì để học môn Kinh tế Vi mô? Mình đang bị vướng phần cân bằng thị trường và lý thuyết hành vi người tiêu dùng.",
    content: "Mọi người thường dùng phương pháp gì để học môn Kinh tế Vi mô? Mình đang bị vướng phần cân bằng thị trường và lý thuyết hành vi người tiêu dùng.",
    type: "discussion",
    author: { name: "Hồ Huy", username: "huyho", avatar: "" },
    likes: 0,
    comments: 0,
    bookmarks: 0,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
    tags: ["kinh-te-vi-mo", "hoc-tap"],
  },
];

// ─── Categories ───────────────────────────────────────────────
export const CATEGORIES = [
  { id: "de-cuong", label: "Đề cương", icon: "BookOpen", count: 0 },
  { id: "de-thi", label: "Đề thi", icon: "FileText", count: 0 },
  { id: "slide", label: "Slide bài giảng", icon: "Presentation", count: 0 },
  { id: "giao-trinh", label: "Giáo trình", icon: "BookMarked", count: 0 },
  { id: "marketing", label: "Marketing", icon: "Megaphone", count: 0 },
  { id: "ke-toan", label: "Kế toán", icon: "TrendingUp", count: 0 },
  { id: "quan-tri", label: "Quản trị", icon: "Code", count: 0 },
  { id: "luat", label: "Luật", icon: "Scale", count: 0 },
];
