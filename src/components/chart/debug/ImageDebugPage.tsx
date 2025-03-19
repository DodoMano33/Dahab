
import React, { useState, useEffect } from 'react';
import { useImageCapture } from '@/hooks/useImageCapture';
import { enhanceImageForOcr } from '@/utils/price/image/imageEnhancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TradingViewWidget from '../TradingViewWidget';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import { Home, Camera, Download, Image } from 'lucide-react';

export const ImageDebugPage: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [captureTime, setCaptureTime] = useState<string | null>(null);
  const { captureTradingViewWidget, captureAttempts } = useImageCapture();
  
  const handleCaptureImage = async () => {
    try {
      const currentTime = new Date().toLocaleTimeString();
      setCaptureTime(currentTime);
      
      // التقاط صورة الويدجيت
      const capturedImage = await captureTradingViewWidget();
      console.log('تم التقاط صورة الويدجيت بنجاح');
      
      if (capturedImage) {
        setOriginalImage(capturedImage);
        console.log('تم التقاط الصورة بنجاح:', capturedImage.substring(0, 100) + '...');
      } else {
        console.error('فشل التقاط الصورة');
      }
    } catch (error) {
      console.error('خطأ في التقاط الصورة:', error);
    }
  };
  
  const handleTradingViewScreenshot = () => {
    // استخدام الدالة العامة التي أضفناها في مكون TradingViewWidget
    if (typeof (window as any).takeWidgetScreenshot === 'function') {
      (window as any).takeWidgetScreenshot();
    } else {
      console.error('وظيفة التقاط الشاشة غير متاحة');
      // محاولة بديلة باستخدام html2canvas
      takeFallbackScreenshot();
    }
  };

  const takeFallbackScreenshot = async () => {
    try {
      const widgetElement = document.querySelector('.tradingview-widget-container') as HTMLElement;
      if (!widgetElement) {
        console.error('لم يتم العثور على عنصر ويدجيت TradingView');
        return;
      }

      console.log('استخدام html2canvas كبديل للتقاط الشاشة...');
      const canvas = await html2canvas(widgetElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `tradingview-fallback-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (error) {
      console.error('فشل التقاط الشاشة البديل:', error);
    }
  };

  const handleDownloadImage = () => {
    if (originalImage) {
      const link = document.createElement('a');
      link.href = originalImage;
      link.download = `tradingview-capture-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
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
    <div className="container mx-auto my-8 p-4 max-w-5xl">
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
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle className="text-center">ويدجيت TradingView</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <TradingViewWidget />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mb-4 gap-3">
        <Button 
          onClick={handleCaptureImage} 
          className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
        >
          <Camera size={16} />
          التقاط صورة للويدجيت
        </Button>
        
        <Button 
          onClick={handleTradingViewScreenshot} 
          className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
        >
          <Image size={16} />
          استخدام TakeScreenshot
        </Button>
        
        {originalImage && (
          <Button 
            onClick={handleDownloadImage} 
            className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
          >
            <Download size={16} />
            تنزيل الصورة
          </Button>
        )}
      </div>
      
      {captureTime && (
        <p className="text-center mb-6 text-gray-600">
          آخر التقاط: {captureTime} | محاولة رقم: {captureAttempts}
        </p>
      )}
      
      {originalImage && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>الصورة الملتقطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-300 rounded-md p-2 overflow-auto">
              <img 
                src={originalImage} 
                alt="صورة ويدجيت TradingView" 
                className="w-full h-auto"
              />
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">معلومات الصورة:</h4>
              <p className="text-sm text-gray-600">طول البيانات: {originalImage.length} حرف</p>
              <p className="text-sm text-gray-600 mt-1">نوع الصورة: {originalImage.substring(0, 30)}...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
