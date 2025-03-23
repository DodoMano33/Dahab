
import { PriceData } from '../indicators';

// أنواع أنماط الشموع المدعومة
export type CandlePatternType = 
  | 'Doji' 
  | 'Hammer' 
  | 'InvertedHammer' 
  | 'BullishEngulfing' 
  | 'BearishEngulfing'
  | 'BullishHarami'
  | 'BearishHarami'
  | 'EveningStar'
  | 'MorningStar'
  | 'ShootingStar'
  | 'ThreeWhiteSoldiers'
  | 'ThreeBlackCrows';

export type PatternResult = {
  pattern: CandlePatternType;
  signal: 'صاعد' | 'هابط' | 'محايد';
  confidence: number; // نسبة الثقة (0-1)
  description: string;
};
