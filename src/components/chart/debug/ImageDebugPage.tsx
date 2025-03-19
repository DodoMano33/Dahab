
import React, { useState, useEffect } from 'react';
import { useImageCapture } from '@/hooks/useImageCapture';
import { enhanceImageForOcr } from '@/utils/price/image/imageEnhancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TradingViewWidget from '../TradingViewWidget';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const ImageDebugPage: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
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
        
        // تحسين الصورة
        const enhanced = await enhanceImageForOcr(capturedImage);
        setEnhancedImage(enhanced);
        console.log('تم تحسين الصورة بنجاح');
      } else {
        console.error('فشل التقاط الصورة');
      }
    } catch (error) {
      console.error('خطأ في التقاط الصورة:', error);
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
    <div className="container mx-auto my-8 p-4 max-w-4xl">
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
      
      <div className="flex justify-center mb-4">
        <Button 
          onClick={handleCaptureImage} 
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          التقاط صورة للويدجيت
        </Button>
      </div>
      
      {captureTime && (
        <p className="text-center mb-6 text-gray-600">
          آخر التقاط: {captureTime} | محاولة رقم: {captureAttempts}
        </p>
      )}
      
      <div className="grid md:grid-cols-2 gap-8">
        {originalImage && (
          <Card>
            <CardHeader>
              <CardTitle>الصورة الأصلية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-300 rounded-md p-2 overflow-auto max-h-[500px]">
                <img 
                  src={originalImage} 
                  alt="صورة ويدجيت TradingView الأصلية" 
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">معلومات الصورة الأصلية:</h4>
                <p className="text-sm text-gray-600">طول البيانات: {originalImage.length} حرف</p>
                <p className="text-sm text-gray-600 mt-1">نوع الصورة: {originalImage.substring(0, 30)}...</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {enhancedImage && (
          <Card>
            <CardHeader>
              <CardTitle>الصورة بعد التحسين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-300 rounded-md p-2 overflow-auto max-h-[500px]">
                <img 
                  src={enhancedImage} 
                  alt="صورة ويدجيت TradingView بعد التحسين" 
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">معلومات الصورة المحسنة:</h4>
                <p className="text-sm text-gray-600">طول البيانات: {enhancedImage.length} حرف</p>
                <p className="text-sm text-gray-600 mt-1">نوع الصورة: {enhancedImage.substring(0, 30)}...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
