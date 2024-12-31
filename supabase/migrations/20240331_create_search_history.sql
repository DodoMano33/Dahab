-- إنشاء نوع enum لأنواع التحليل
CREATE TYPE analysis_type AS ENUM (
  'عادي',
  'سكالبينج',
  'ذكي',
  'SMC',
  'ICT',
  'Turtle Soup'
  -- يمكن إضافة المزيد من الأنواع في المستقبل باستخدام:
  -- ALTER TYPE analysis_type ADD VALUE 'نوع_جديد';
);

-- إنشاء جدول سجل البحث
CREATE TABLE public.search_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  symbol text NOT NULL,
  current_price numeric NOT NULL,
  analysis jsonb NOT NULL,
  analysis_type analysis_type NOT NULL
);

-- إعداد سياسات أمان الصفوف (RLS)
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة للسماح للمستخدمين برؤية سجل البحث الخاص بهم فقط
CREATE POLICY "Users can view their own search history"
  ON public.search_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- إنشاء سياسة للسماح للمستخدمين بإضافة سجلات بحث جديدة
CREATE POLICY "Users can insert their own search history"
  ON public.search_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- إنشاء سياسة للسماح للمستخدمين بحذف سجلات البحث الخاصة بهم
CREATE POLICY "Users can delete their own search history"
  ON public.search_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- إنشاء فهرس للبحث السريع
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX idx_search_history_symbol ON public.search_history(symbol);
CREATE INDEX idx_search_history_created_at ON public.search_history(created_at);

-- إضافة دالة مساعدة لإضافة أنواع تحليل جديدة
CREATE OR REPLACE FUNCTION add_analysis_type(new_type text)
RETURNS void AS $$
BEGIN
    -- التحقق مما إذا كان النوع موجود بالفعل
    IF NOT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'analysis_type' 
        AND typelem = 0
    ) THEN
        RAISE EXCEPTION 'نوع analysis_type غير موجود';
    END IF;

    -- إضافة القيمة الجديدة إلى نوع enum
    EXECUTE format('ALTER TYPE analysis_type ADD VALUE IF NOT EXISTS %L', new_type);
END;
$$ LANGUAGE plpgsql;

-- مثال على كيفية إضافة نوع تحليل جديد:
-- SELECT add_analysis_type('نوع_جديد');