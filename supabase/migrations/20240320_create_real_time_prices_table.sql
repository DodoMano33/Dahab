
-- إنشاء جدول real_time_prices
CREATE TABLE IF NOT EXISTS public.real_time_prices (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(symbol)
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_real_time_prices_symbol ON public.real_time_prices(symbol);

-- تمكين الوصول من خلال row level security
ALTER TABLE public.real_time_prices ENABLE ROW LEVEL SECURITY;

-- السماح للمستخدمين المصادق عليهم بقراءة السعر
CREATE POLICY "Allow users to read prices" ON public.real_time_prices
  FOR SELECT USING (true);

-- السماح لـ anon و service_role بإضافة وتحديث البيانات
CREATE POLICY "Allow service role to insert and update" ON public.real_time_prices
  FOR ALL USING (auth.role() = 'service_role');

-- إضافة الجدول للمزامنة في الوقت الحقيقي
ALTER PUBLICATION supabase_realtime ADD TABLE public.real_time_prices;
ALTER TABLE public.real_time_prices REPLICA IDENTITY FULL;

-- إضافة بعض البيانات الأولية
INSERT INTO public.real_time_prices (symbol, price, updated_at)
VALUES 
  ('XAUUSD', 2200.00, NOW()),
  ('EURUSD', 1.0856, NOW()),
  ('GBPUSD', 1.2745, NOW()),
  ('BTCUSD', 68500.00, NOW())
ON CONFLICT (symbol) DO UPDATE
SET price = EXCLUDED.price, updated_at = EXCLUDED.updated_at;

-- إضافة وظيفة لإنشاء جدولة تحديث الأسعار
CREATE OR REPLACE FUNCTION public.create_real_time_prices_schedule()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- حذف الجدولة إذا كانت موجودة بالفعل
  PERFORM cron.unschedule('update-real-time-prices-every-minute');
  
  -- إنشاء جدولة جديدة
  PERFORM cron.schedule(
    'update-real-time-prices-every-minute',
    '* * * * *',  -- تشغيل كل دقيقة
    $$
    SELECT
      net.http_post(
        url:=current_setting('app.supabase_url') || '/functions/v1/update-real-time-prices',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.supabase_anon_key') || '"}'::jsonb,
        body:='{}'::jsonb
      ) as request_id;
    $$
  );
END;
$$;

-- إضافة متغيرات تطبيق
DO
$$
BEGIN
  -- التحقق مما إذا كانت المتغيرات قد تم تعيينها بالفعل
  IF NOT EXISTS (SELECT 1 FROM pg_settings WHERE name = 'app.supabase_url') THEN
    -- تعيين متغيرات التطبيق
    ALTER DATABASE postgres SET "app.supabase_url" = '';
    ALTER DATABASE postgres SET "app.supabase_anon_key" = '';
  END IF;
END;
$$;

COMMENT ON TABLE public.real_time_prices IS 'جدول لتخزين أسعار العملات والمعادن الثمينة في الوقت الحقيقي';
