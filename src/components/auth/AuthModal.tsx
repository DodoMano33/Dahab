
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthError = (error: any) => {
    console.error('Authentication error:', error);
    
    if (error.message.includes('Invalid login credentials')) {
      toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة', {
        duration: 3000, // تعديل مدة التنبيه
      });
    } else if (error.message.includes('Email not confirmed')) {
      toast.error('البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الإلكتروني للحصول على رابط التأكيد', {
        duration: 3000, // تعديل مدة التنبيه
      });
    } else if (error.message.includes('Password should be at least 6 characters')) {
      toast.error('يجب أن تكون كلمة المرور 6 أحرف على الأقل', {
        duration: 3000, // تعديل مدة التنبيه
      });
    } else {
      toast.error('حدث خطأ أثناء تسجيل الدخول', {
        duration: 3000, // تعديل مدة التنبيه
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (error) throw error;

        toast.success('تم تسجيل الدخول بنجاح', {
          duration: 3000, // تعديل مدة التنبيه
        });
        onClose();
      } else {
        if (password.length < 6) {
          toast.error('يجب أن تكون كلمة المرور 6 أحرف على الأقل', {
            duration: 3000, // تعديل مدة التنبيه
          });
          return;
        }

        const { error, data } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            emailRedirectTo: window.location.origin
          }
        });

        if (error) throw error;

        if (data.user && data.user.identities && data.user.identities.length === 0) {
          toast.error('البريد الإلكتروني مسجل بالفعل', {
            duration: 3000, // تعديل مدة التنبيه
          });
        } else {
          toast.success('تم إرسال رابط التأكيد إلى بريدك الإلكتروني', {
            duration: 3000, // تعديل مدة التنبيه
          });
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className="text-left"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">كلمة المرور</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
              className="text-left"
              placeholder="******"
              minLength={6}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? '...' : isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
