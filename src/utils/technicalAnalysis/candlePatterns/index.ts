
// Re-export types
export * from './types';

// Re-export pattern detection functions from each module
// For modules with conflicting exports, we need to be explicit
export {
  isDoji,
  isDragonFlyDoji,
  isGravestoneDoji,
  isHammer,
  isInvertedHammer,
  isShootingStar,
  isHangingMan,
  isSpinningTop,
  isMarubozu
} from './singleCandlePatterns';

export {
  isBullishEngulfing,
  isBearishEngulfing,
  isBullishHarami,
  isBearishHarami,
  isPiercingLine,
  isDarkCloudCover,
  isTweezerTop,
  isTweezerBottom
} from './twoCandlePatterns';

// Export all three candle patterns from the new module structure
export * from './threeCandlePatterns';

// Re-export utilities, being careful with the isDoji conflict
export {
  getBodySize,
  getUpperShadow,
  getLowerShadow,
  getCandleSize,
  isBullishCandle,
  isBearishCandle,
  // isDoji is already exported from singleCandlePatterns
  getUpperShadowRatio,
  getLowerShadowRatio,
  getBodyRatio,
  hasLongUpperShadow,
  hasLongLowerShadow,
  hasGapUp,
  hasGapDown,
  calculateSMA,
  detectTrend,
  getPatternStrengthByVolume
} from './utils';

// Re-export pattern detector and detector functions
export * from './patternDetector';
export * from './detectors';
