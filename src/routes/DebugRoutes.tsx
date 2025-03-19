
import React from 'react';
import { Route } from 'react-router-dom';
import ImageDebug from '@/pages/ImageDebug';

export const DebugRoutes = () => {
  return (
    <Route path="/debug-image" element={<ImageDebug />} />
  );
};

/**
 * كيفية الاستخدام:
 * في ملف App.tsx، قم بإضافة هذا المكون داخل <Routes>:
 * 
 * import { DebugRoutes } from './routes/DebugRoutes';
 * 
 * <Routes>
 *   {/* المسارات الحالية *\/}
 *   <DebugRoutes />
 * </Routes>
 */
