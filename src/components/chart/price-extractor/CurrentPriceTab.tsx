
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RotateCwIcon } from 'lucide-react';
import { CustomSelectorsInput } from './CustomSelectorsInput';

interface CurrentPriceTabProps {
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
  formattedPrice: string;
  isExtracting: boolean;
  formattedTime: string;
  source: string;
  customInterval: string;
  setCustomInterval: (value: string) => void;
  handleIntervalChange: () => void;
  extractPriceFromDOM: () => void;
  customSelectors: string[];
  onCustomSelectorsChange: (selectors: string[]) => void;
}

export const CurrentPriceTab: React.FC<CurrentPriceTabProps> = ({
  isEnabled,
  setIsEnabled,
  formattedPrice,
  isExtracting,
  formattedTime,
  source,
  customInterval,
  setCustomInterval,
  handleIntervalChange,
  extractPriceFromDOM,
  customSelectors,
  onCustomSelectorsChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">قارئ السعر التلقائي</h3>
        <div className="flex items-center gap-2">
          <Switch 
            id="extractor-switch" 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled} 
          />
          <Label htmlFor="extractor-switch">
            {isEnabled ? 'مُفعّل' : 'معطّل'}
          </Label>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">السعر الحالي:</span>
          <span className={`text-lg font-bold ${isExtracting ? 'text-orange-500 animate-pulse' : 'text-green-600'}`}>
            {formattedPrice}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">آخر تحديث:</span>
          <span className="text-sm">{formattedTime}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">المصدر:</span>
          <Badge variant="outline" className="text-xs">
            {source}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2 mt-2">
          <div className="flex items-center space-x-2 flex-1">
            <Input
              className="w-20 text-right"
              type="number"
              min="1"
              value={customInterval}
              onChange={(e) => setCustomInterval(e.target.value)}
            />
            <span className="text-sm whitespace-nowrap">ثانية</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleIntervalChange}
          >
            تحديث الفاصل الزمني
          </Button>
        </div>
        
        <Button 
          className="mt-2" 
          size="sm" 
          disabled={!isEnabled || isExtracting}
          onClick={() => {
            if (isEnabled) {
              extractPriceFromDOM();
            }
          }}
        >
          <RotateCwIcon className="ml-2 h-4 w-4" />
          {isExtracting ? 'جاري القراءة...' : 'قراءة السعر الآن'}
        </Button>

        <div className="pt-3 mt-3 border-t">
          <CustomSelectorsInput 
            selectors={customSelectors} 
            onChange={onCustomSelectorsChange} 
          />
        </div>
      </div>
    </div>
  );
};
