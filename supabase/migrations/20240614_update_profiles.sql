
-- إضافة أعمدة جديدة إلى جدول الملفات الشخصية للمستخدمين
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS auto_check_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS auto_check_interval INTEGER DEFAULT 30;

-- إنشاء فهرس على عمود البريد الإلكتروني لتسريع عمليات البحث
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- إضافة حقل تبقى وقت التحليل إلى جدول سجل البحث
ALTER TABLE IF EXISTS public.search_history
ADD COLUMN IF NOT EXISTS time_remaining_hours INTEGER;

-- تحديث الدالة لحساب الوقت المتبقي للتحليل
CREATE OR REPLACE FUNCTION public.update_analysis_time_remaining()
RETURNS TRIGGER AS $$
BEGIN
  -- عند إنشاء تحليل جديد، حساب الوقت المتبقي
  IF TG_OP = 'INSERT' THEN
    NEW.time_remaining_hours := COALESCE(NEW.analysis_duration_hours, 8);
  -- عند تحديث تحليل، تحديث الوقت المتبقي
  ELSIF TG_OP = 'UPDATE' AND NEW.last_checked_at IS NOT NULL AND OLD.last_checked_at IS DISTINCT FROM NEW.last_checked_at THEN
    NEW.time_remaining_hours := GREATEST(0, 
      COALESCE(NEW.analysis_duration_hours, 8) - 
      EXTRACT(EPOCH FROM (NEW.last_checked_at - NEW.created_at)) / 3600
    )::INTEGER;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء التريجر لتحديث الوقت المتبقي للتحليل
DROP TRIGGER IF EXISTS update_time_remaining_trigger ON public.search_history;
CREATE TRIGGER update_time_remaining_trigger
BEFORE INSERT OR UPDATE ON public.search_history
FOR EACH ROW
EXECUTE FUNCTION public.update_analysis_time_remaining();
