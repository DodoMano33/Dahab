
import { PriceData } from '../indicators/types';

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
  | 'ThreeBlackCrows'
  | 'PiercingLine'
  | 'DarkCloudCover'
  | 'SpinningTop'
  | 'Marubozu'
  | 'DragonFlyDoji'
  | 'GravestoneDoji';

export type PatternResult = {
  pattern: CandlePatternType;
  signal: 'صاعد' | 'هابط' | 'محايد';
  confidence: number; // نسبة الثقة (0-1)
  description: string;
};
