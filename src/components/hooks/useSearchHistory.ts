
// هذا الملف موجود للتوافقية مع الشيفرة القديمة فقط
// يجب تحديث جميع الاستيرادات لاستخدام الموقع الجديد: src/components/hooks/search-history
import { useSearchHistory } from './search-history';

// تصدير الهوك من الموقع الجديد
export { useSearchHistory };

// الاستيراد الافتراضي ليعمل مع كلا النمطين من الاستيراد
export default useSearchHistory;
