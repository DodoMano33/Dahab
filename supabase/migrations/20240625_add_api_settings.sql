
-- إضافة أعمدة جديدة إلى جدول الملفات الشخصية للمستخدمين لتخزين إعدادات API
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS alpha_vantage_api_key TEXT,
ADD COLUMN IF NOT EXISTS price_update_interval INTEGER DEFAULT 30;

-- تعديل التعليق على أعمدة الفحص التلقائي للتوضيح
COMMENT ON COLUMN public.profiles.auto_check_interval IS 'فاصل الفحص التلقائي بالثواني';
COMMENT ON COLUMN public.profiles.price_update_interval IS 'فاصل تحديث السعر بالثواني';
COMMENT ON COLUMN public.profiles.alpha_vantage_api_key IS 'مفتاح Alpha Vantage API';
