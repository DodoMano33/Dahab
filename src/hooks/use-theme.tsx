
import { useState, useEffect } from 'react';

// Export the Theme type so it can be imported elsewhere
export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // محاولة استرداد القيمة المخزنة محلياً
    const savedTheme = localStorage.getItem('theme') as Theme;
    // التحقق من تفضيلات المستخدم في النظام
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // تحديث class على عنصر html
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    // إذا كان الوضع "system"، نقوم بتطبيق وضع النظام
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  return { theme, setTheme, toggleTheme };
}
