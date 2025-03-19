
import React, { useState, useEffect, useRef } from 'react';
import { useImageCapture } from '@/hooks/useImageCapture';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TradingViewWidget from '../TradingViewWidget';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, AlertCircle, Camera, Download } from 'lucide-react';
import { toast } from 'sonner';

export const ImageDebugPage: React.FC = () => {
  const [screenImage, setScreenImage] = useState<string | null>(null);
  const [captureTime, setCaptureTime] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const { 
    captureTradingViewWidget, 
    captureFullScreen, 
    captureAttempts, 
    isCapturing, 
    captureError 
  } = useImageCapture();
  
  // التقاط صورة للويدجيت
  const handleCaptureWidget = async () => {
    try {
      const currentTime = new Date().toLocaleTimeString();
      setCaptureTime(currentTime);
      
      toast.info("جاري التقاط صورة الويدجيت...", {
        duration: 2000,
      });
      
      // التقاط صورة الويدجيت
      const capturedImage = await captureTradingViewWidget();
      
      if (capturedImage) {
        setScreenImage(capturedImage);
        console.log('تم التقاط صورة الويدجيت بنجاح:', capturedImage.substring(0, 100) + '...');
        toast.success("تم التقاط صورة الويدجيت بنجاح");
      } else {
        console.error('فشل التقاط صورة الويدجيت');
        toast.error(captureError || "فشل التقاط صورة الويدجيت");
      }
    } catch (error) {
      console.error('خطأ في التقاط صورة الويدجيت:', error);
      toast.error("حدث خطأ أثناء التقاط صورة الويدجيت");
    }
  };
  
  // التقاط صورة للصفحة الكاملة (سكرين شوت)
  const handleCaptureFullScreen = async () => {
    try {
      if (!pageRef.current) {
        toast.error("لا يمكن العثور على عنصر الصفحة");
        return;
      }
      
      const currentTime = new Date().toLocaleTimeString();
      setCaptureTime(currentTime);
      
      toast.info("جاري التقاط صورة للشاشة الكاملة...", {
        duration: 2000,
      });
      
      // استخدام الدالة المحسنة لالتقاط صورة الشاشة الكاملة
      const imageUrl = await captureFullScreen();
      
      if (imageUrl) {
        setScreenImage(imageUrl);
        console.log('تم التقاط صورة الشاشة بنجاح:', imageUrl.substring(0, 100) + '...');
        toast.success("تم التقاط صورة الشاشة بنجاح");
      } else {
        console.error('فشل التقاط صورة الشاشة');
        toast.error(captureError || "فشل التقاط صورة الشاشة");
      }
    } catch (error) {
      console.error('خطأ في التقاط صورة الشاشة:', error);
      toast.error("حدث خطأ أثناء التقاط صورة الشاشة");
    }
  };
  
  // تنزيل الصورة الملتقطة
  const handleDownloadImage = () => {
    if (!screenImage) {
      toast.error("لا توجد صورة للتنزيل");
      return;
    }
    
    try {
      // إنشاء رابط تنزيل
      const link = document.createElement('a');
      link.href = screenImage;
      link.download = `screen-capture-${new Date().toISOString().replace(/:/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("تم تنزيل الصورة بنجاح");
    } catch (error) {
      console.error('خطأ في تنزيل الصورة:', error);
      toast.error("حدث خطأ أثناء تنزيل الصورة");
    }
  };
  
  // التقاط الصورة عند تحميل الصفحة
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCaptureFullScreen();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={pageRef} className="container mx-auto my-8 p-4 max-w-5xl">
      {/* زر الرجوع إلى الصفحة الرئيسية */}
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Home size={16} />
            <span>الرجوع إلى الصفحة الرئيسية</span>
          </Button>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-center mb-8">صفحة فحص وتصحيح الصور</h1>
      
      <div className="flex justify-center mb-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">ويدجيت TradingView</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <TradingViewWidget />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mb-4 gap-4 flex-wrap">
        <Button 
          onClick={handleCaptureWidget} 
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={isCapturing}
        >
          {isCapturing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              جاري التقاط الصورة...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              التقاط صورة للويدجيت
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleCaptureFullScreen} 
          className="bg-green-600 text-white hover:bg-green-700"
          disabled={isCapturing}
        >
          <Camera className="mr-2 h-4 w-4" />
          التقاط صورة للشاشة الكاملة
        </Button>
        
        {screenImage && (
          <Button 
            onClick={handleDownloadImage} 
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            <Download className="mr-2 h-4 w-4" />
            تنزيل الصورة
          </Button>
        )}
      </div>
      
      {captureTime && (
        <p className="text-center mb-6 text-gray-600">
          آخر التقاط: {captureTime} | محاولة رقم: {captureAttempts}
        </p>
      )}
      
      {captureError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>{captureError}</span>
        </div>
      )}
      
      {screenImage ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>الصورة الملتقطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-300 rounded-md p-2 overflow-hidden">
              <img 
                src={screenImage} 
                alt="الصورة الملتقطة" 
                className="w-full h-auto object-contain"
                onError={(e) => {
                  console.error('خطأ في تحميل الصورة:', e);
                  e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                  e.currentTarget.style.height = '200px';
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onLoad={() => {
                  console.log('تم تحميل الصورة بنجاح');
                }}
              />
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">معلومات الصورة:</h4>
              <p className="text-sm text-gray-600 break-all">طول البيانات: {screenImage.length} حرف</p>
              <p className="text-sm text-gray-600 mt-1 break-all">نوع الصورة: {screenImage.substring(0, 30)}...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full p-12 bg-gray-100 border border-gray-300 rounded-md text-center">
          <p className="text-gray-500 mb-4">لم يتم التقاط أي صورة بعد</p>
          {!isCapturing && (
            <Button onClick={handleCaptureFullScreen} variant="outline">
              <Camera className="mr-2 h-4 w-4" />
              محاولة التقاط صورة للشاشة
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
