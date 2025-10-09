
/**
 * جلب سعر الذهب الحالي من موقع un-web.com
 */
export async function fetchPrice(symbol: string): Promise<number | null> {
  try {
    // جلب السعر من موقع un-web.com
    console.log('جلب سعر الذهب من un-web.com...');
    
    const url = 'https://www.un-web.com/tools/gold_price/';
    
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
    
    // البحث عن العنصر <span id="ounce_usd">VALUE</span>
    const regex = /<span\s+id=["']ounce_usd["'][^>]*>([\d.]+)<\/span>/i;
    const match = html.match(regex);
    
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      
      if (!isNaN(price)) {
        console.log(`تم جلب سعر الذهب من un-web.com: ${price}`);
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
