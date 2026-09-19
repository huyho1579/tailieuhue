-- ==========================================================
-- TAILIEUHUE - SUPABASE DATABASE SCHEMA
-- Chạy đoạn SQL này trong mục "SQL Editor" trên Supabase
-- ==========================================================

-- 1. Bảng TÀI LIỆU (documents)
CREATE TABLE IF NOT EXISTS public.documents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    department TEXT DEFAULT 'Khoa Quản trị kinh doanh',
    semester TEXT DEFAULT 'Học kỳ 1 • Năm học 2024–2025',
    lecturer TEXT DEFAULT 'Bộ môn chuyên ngành HCE',
    type TEXT DEFAULT 'de-cuong',
    is_pro BOOLEAN DEFAULT false,
    price NUMERIC DEFAULT 0,
    pages INT DEFAULT 20,
    file_format TEXT DEFAULT 'Google Drive',
    drive_url TEXT NOT NULL,
    cover_image TEXT,
    cover_theme TEXT DEFAULT 'blue',
    highlights JSONB DEFAULT '[]'::jsonb,
    author TEXT DEFAULT 'Hồ Huy (Admin)',
    description TEXT,
    rating NUMERIC DEFAULT 5.0,
    review_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bảng TÀI LIỆU ĐÃ MUA (purchases)
CREATE TABLE IF NOT EXISTS public.purchases (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_email TEXT NOT NULL,
    doc_id TEXT NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bảng BÀI VIẾT CỘNG ĐỒNG (posts)
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'discussion',
    author_name TEXT NOT NULL DEFAULT 'Thành viên HCE',
    author_email TEXT NOT NULL DEFAULT 'sinhvien@hueuni.edu.vn',
    author_avatar TEXT,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    bookmarks INT DEFAULT 0,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- KÍCH HOẠT ROW LEVEL SECURITY (RLS) & CẤP QUYỀN
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc công khai (Public Read)
CREATE POLICY "Public can view documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Public can view posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public can view purchases" ON public.purchases FOR SELECT USING (true);

-- Cho phép ghi dữ liệu (Insert, Update, Delete)
CREATE POLICY "Allow all insert documents" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update documents" ON public.documents FOR UPDATE USING (true);
CREATE POLICY "Allow all delete documents" ON public.documents FOR DELETE USING (true);

CREATE POLICY "Allow all insert purchases" ON public.purchases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all delete purchases" ON public.purchases FOR DELETE USING (true);

CREATE POLICY "Allow all insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Allow all delete posts" ON public.posts FOR DELETE USING (true);

-- CHÈN DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
INSERT INTO public.documents (
    id, title, slug, subject, department, semester, lecturer, type, is_pro, price, pages, file_format, drive_url, cover_image, cover_theme, highlights, author, description, rating, review_count, view_count, download_count
) VALUES 
(
    'doc-1',
    'Đề cương Marketing Căn bản',
    'de-cuong-marketing-can-ban',
    'Marketing Căn bản',
    'Khoa Quản trị kinh doanh',
    'Học kỳ 1 • Năm học 2024–2025',
    'Bộ môn Marketing HCE',
    'de-cuong',
    false,
    0,
    24,
    'Google Drive',
    'https://drive.google.com/drive/folders/tailieuhue-marketing',
    '',
    'amber',
    '["Hệ thống hóa toàn bộ lý thuyết Marketing 4P và 7P.", "Tổng hợp các dạng bài tập định giá và phân khúc thị trường.", "Bộ câu hỏi ôn tập bám sát cấu trúc đề thi Đại học Kinh tế Huế."]'::jsonb,
    'Hồ Huy (Admin)',
    'Đề cương tổng hợp môn Marketing Căn bản dành cho sinh viên Đại học Kinh tế Huế. Bao gồm toàn bộ lý thuyết trọng tâm, các khái niệm cơ bản và hướng dẫn ôn thi cuối kỳ.',
    5.0,
    18,
    420,
    156
),
(
    'doc-2',
    'Đề cương Kế toán Tài chính',
    'de-cuong-ke-toan-tai-chinh',
    'Kế toán Tài chính',
    'Khoa Kế toán — Kiểm toán',
    'Học kỳ 1 • Năm học 2024–2025',
    'Bộ môn Kế toán HCE',
    'de-cuong',
    true,
    29000,
    38,
    'Google Drive',
    'https://drive.google.com/drive/folders/tailieuhue-ketoan',
    '',
    'emerald',
    '["Đầy đủ sơ đồ chữ T và định khoản các nghiệp vụ kinh tế.", "Bài tập mẫu có lời giải chi tiết từng bước.", "Tổng hợp đề thi các năm trước có đáp án chuẩn."]'::jsonb,
    'Hồ Huy (Admin)',
    'Tài liệu ôn thi Kế toán Tài chính chuyên sâu, hướng dẫn định khoản từng tài khoản theo thông tư mới nhất. Kèm theo bài tập thực hành thi cuối kỳ đạt điểm cao.',
    5.0,
    32,
    780,
    240
),
(
    'doc-3',
    'Đề cương Kinh tế Vi mô 1',
    'de-cuong-kinh-te-vi-mo-1',
    'Kinh tế Vi mô',
    'Khoa Kinh tế & Phát triển',
    'Học kỳ 1 • Năm học 2024–2025',
    'Bộ môn Kinh tế học HCE',
    'de-cuong',
    false,
    0,
    28,
    'Google Drive',
    'https://drive.google.com/drive/folders/tailieuhue-vimo',
    '',
    'blue',
    '["Công thức tính co giãn cung cầu, thặng dư tiêu dùng và sản xuất.", "Lý thuyết hành vi người tiêu dùng và tối đa hóa lợi nhuận.", "Bài tập đồ thị trắc nghiệm và tự luận."]'::jsonb,
    'Hồ Huy (Admin)',
    'Hệ thống kiến thức Kinh tế Vi mô 1 chuẩn Đại học Kinh tế Huế. Giúp sinh viên nắm chắc cách vẽ đồ thị và giải bài tập tính toán nhanh trong phòng thi.',
    4.9,
    25,
    650,
    195
)
ON CONFLICT (slug) DO NOTHING;
