import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = 'YOUR_API_KEY'; // يجب استبدالها بمفتاح API حقيقي

export const fetchForexPrice = async (symbol: string): Promise<number> => {
  console.log(`بدء طلب سعر الفوركس للرمز ${symbol}`);

  try {
    // تحليل الرمز للحصول على العملات
    const fromCurrency = symbol.slice(0, 3);
    const toCurrency = symbol.slice(3, 6);

    const params = {
      function: 'CURRENCY_EXCHANGE_RATE',
      from_currency: fromCurrency,
      to_currency: toCurrency,
      apikey: ALPHA_VANTAGE_API_KEY
    };

    console.log('إرسال طلب:', {
      url: 'https://www.alphavantage.co/query',
      method: 'get',
      params
    });

    const response = await axios.get('https://www.alphavantage.co/query', { params });

    console.log('استجابة ناجحة:', {
      url: 'https://www.alphavantage.co/query',
      status: response.status,
      data: response.data
    });

    if (response.data['Realtime Currency Exchange Rate']) {
      const price = parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
      if (!isNaN(price)) {
        return price;
      }
    }

    throw new Error('بيانات السعر غير صالحة في الاستجابة');
  } catch (error) {
    console.error('خطأ في جلب سعر الفوركس:', error);
    throw new Error('حدث خطأ في جلب السعر. الرجاء إدخال السعر يدوياً');
  }
};

export const fetchStockPrice = async (symbol: string): Promise<number> => {
  console.log(`بدء طلب سعر السهم للرمز ${symbol}`);

  try {
    const params = {
      function: 'GLOBAL_QUOTE',
      symbol: symbol,
      apikey: ALPHA_VANTAGE_API_KEY
    };

    console.log('إرسال طلب:', {
      url: 'https://www.alphavantage.co/query',
      method: 'get',
      params
    });

    const response = await axios.get('https://www.alphavantage.co/query', { params });

    console.log('استجابة ناجحة:', {
      url: 'https://www.alphavantage.co/query',
      status: response.status,
      data: response.data
    });

    if (response.data['Global Quote']) {
      const price = parseFloat(response.data['Global Quote']['05. price']);
      if (!isNaN(price)) {
        return price;
      }
    }

    throw new Error('بيانات السعر غير صالحة في الاستجابة');
  } catch (error) {
    console.error('خطأ في جلب سعر السهم:', error);
    throw new Error('حدث خطأ في جلب السعر. الرجاء إدخال السعر يدوياً');
  }
};