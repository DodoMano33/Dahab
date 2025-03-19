
import React, { useState, useEffect, useRef } from 'react';
import { useImageCapture } from '@/hooks/useImageCapture';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TradingViewWidget from '../TradingViewWidget';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, AlertCircle, Camera } from 'lucide-react';
import { toast } from 'sonner';

export const ImageDebugPage: React.FC = () => {
  const [screenImage, setScreenImage] = useState<string | null>(null);
  const [captureTime, setCaptureTime] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const { captureTradingViewWidget, captureAttempts, isCapturing, captureError } = useImageCapture();
  
  const handleCaptureImage = async () => {
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
        console.log('تم التقاط الصورة بنجاح:', capturedImage.substring(0, 100) + '...');
        toast.success("تم التقاط الصورة بنجاح");
      } else {
        console.error('فشل التقاط الصورة');
        toast.error(captureError || "فشل التقاط الصورة");
      }
    } catch (error) {
      console.error('خطأ في التقاط الصورة:', error);
      toast.error("حدث خطأ أثناء التقاط الصورة");
    }
  };
  
  // التقاط صورة للصفحة الكاملة
  const handleCaptureFullPage = async () => {
    try {
      if (!pageRef.current) {
        toast.error("لا يمكن العثور على عنصر الصفحة");
        return;
      }
      
      const currentTime = new Date().toLocaleTimeString();
      setCaptureTime(currentTime);
      
      toast.info("جاري التقاط صورة للصفحة الكاملة...", {
        duration: 2000,
      });
      
      // استخدام html2canvas لالتقاط صورة الصفحة
      const canvas = await html2canvas(document.documentElement, {
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 1,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });
      
      // تحويل Canvas إلى URL صورة
      const imageUrl = canvas.toDataURL('image/png');
      setScreenImage(imageUrl);
      console.log('تم التقاط صورة الصفحة بنجاح:', imageUrl.substring(0, 100) + '...');
      toast.success("تم التقاط صورة الصفحة بنجاح");
      
    } catch (error) {
      console.error('خطأ في التقاط صورة الصفحة:', error);
      toast.error("حدث خطأ أثناء التقاط صورة الصفحة");
    }
  };
  
  // التقاط الصورة عند تحميل الصفحة
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCaptureImage();
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
      
      <div className="flex justify-center mb-4 gap-4">
        <Button 
          onClick={handleCaptureImage} 
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={isCapturing}
        >
          {isCapturing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              جاري التقاط الصورة...
            </>
          ) : (
            "التقاط صورة للويدجيت"
          )}
        </Button>
        
        <Button 
          onClick={handleCaptureFullPage} 
          className="bg-green-600 text-white hover:bg-green-700"
          disabled={isCapturing}
        >
          <Camera className="mr-2 h-4 w-4" />
          التقاط صورة للصفحة الكاملة
        </Button>
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
            <div className="border border-gray-300 rounded-md p-2 overflow-auto">
              <img 
                src={screenImage} 
                alt="الصورة الملتقطة" 
                className="w-full h-auto"
              />
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">معلومات الصورة:</h4>
              <p className="text-sm text-gray-600">طول البيانات: {screenImage.length} حرف</p>
              <p className="text-sm text-gray-600 mt-1">نوع الصورة: {screenImage.substring(0, 30)}...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full p-12 bg-gray-100 border border-gray-300 rounded-md text-center">
          <p className="text-gray-500 mb-4">لم يتم التقاط أي صورة بعد</p>
          {!isCapturing && (
            <Button onClick={handleCaptureImage} variant="outline">
              محاولة التقاط صورة
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
