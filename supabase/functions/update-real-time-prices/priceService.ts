
/**
 * جلب سعر الذهب الحالي من موقع investing.com
 */
export async function fetchPrice(symbol: string): Promise<number | null> {
  try {
    // جلب السعر من موقع investing.com
    console.log('جلب سعر الذهب من investing.com...');
    
    const url = 'https://www.investing.com/currencies/xau-usd';
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });
    
    if (!response.ok) {
      throw new Error(`فشل في جلب الصفحة: ${response.status}`);
    }
    
    const html = await response.text();
    
    // البحث عن العنصر <span id="last_last">VALUE</span>
    const regex = /<span\s+id=["']last_last["'][^>]*>([\d,]+\.?\d*)<\/span>/i;
    const match = html.match(regex);
    
    if (match && match[1]) {
      // إزالة الفواصل من الرقم
      const priceString = match[1].replace(/,/g, '');
      const price = parseFloat(priceString);
      
      if (!isNaN(price)) {
        console.log(`تم جلب سعر الذهب من investing.com: ${price}`);
        return price;
      }
    }
    
    console.error('لم يتم العثور على سعر الذهب في الصفحة');
    return null;
  } catch (error: any) {
    console.error(`خطأ في جلب سعر الذهب:`, error);
    return null;
  }
}
