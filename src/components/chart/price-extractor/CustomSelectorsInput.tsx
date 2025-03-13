
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, XCircle, List } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CustomSelectorsInputProps {
  selectors: string[];
  onChange: (selectors: string[]) => void;
}

export const CustomSelectorsInput: React.FC<CustomSelectorsInputProps> = ({
  selectors,
  onChange
}) => {
  const [showInput, setShowInput] = useState(false);
  const [newSelector, setNewSelector] = useState('');
  const [showAllSelectors, setShowAllSelectors] = useState(false);
  const [bulkInput, setBulkInput] = useState('');

  const handleAddSelector = () => {
    if (newSelector.trim() === '') return;
    
    // تجنب تكرار المحددات
    if (selectors.includes(newSelector.trim())) {
      setNewSelector('');
      return;
    }
    
    const updatedSelectors = [...selectors, newSelector.trim()];
    onChange(updatedSelectors);
    setNewSelector('');
  };

  const handleRemoveSelector = (index: number) => {
    const updatedSelectors = selectors.filter((_, i) => i !== index);
    onChange(updatedSelectors);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSelector();
    }
  };

  const handleBulkAdd = () => {
    if (bulkInput.trim() === '') return;
    
    // تقسيم النص إلى أسطر وإزالة الفراغات الزائدة
    const newSelectors = bulkInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '' && !selectors.includes(line));
    
    if (newSelectors.length > 0) {
      const updatedSelectors = [...selectors, ...newSelectors];
      onChange(updatedSelectors);
      setBulkInput('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-medium">المحددات المخصصة</h4>
          <Badge variant="outline">{selectors.length}</Badge>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setShowAllSelectors(!showAllSelectors)}
            className="h-8 px-2 text-xs"
          >
            <List className="h-4 w-4 ml-1" />
            {showAllSelectors ? 'إخفاء' : 'عرض الكل'}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowInput(!showInput)}
            className="h-8 px-2 text-xs"
          >
            <PlusCircle className="h-4 w-4 ml-1" />
            {showInput ? 'إلغاء' : 'إضافة محدد'}
          </Button>
        </div>
      </div>

      {showInput && (
        <div className="space-y-2 p-2 border rounded-md">
          <div className="flex items-center space-x-2">
            <Input
              className="flex-1 text-xs"
              placeholder="أدخل محدد CSS (مثال: .price-value)"
              value={newSelector}
              onChange={(e) => setNewSelector(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              size="sm" 
              onClick={handleAddSelector}
              className="h-8"
            >
              إضافة
            </Button>
          </div>
          <div className="pt-2 border-t">
            <h5 className="text-xs mb-1 font-medium">إضافة محددات متعددة</h5>
            <Textarea
              placeholder="أدخل محدد في كل سطر"
              className="text-xs min-h-[60px]"
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
            />
            <Button 
              size="sm" 
              className="mt-2 h-8" 
              onClick={handleBulkAdd}
            >
              إضافة المحددات
            </Button>
          </div>
        </div>
      )}

      {showAllSelectors && selectors.length > 0 && (
        <div className="max-h-40 overflow-y-auto border rounded-md p-2">
          <ul className="space-y-1">
            {selectors.map((selector, index) => (
              <li key={index} className="flex justify-between items-center text-xs bg-muted/30 p-1 rounded">
                <code className="text-xs overflow-hidden overflow-ellipsis">{selector}</code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveSelector(index)}
                  className="h-6 w-6 p-0"
                >
                  <XCircle className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectors.length > 0 && !showAllSelectors && (
        <div className="flex flex-wrap gap-1">
          {selectors.slice(0, 3).map((selector, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {selector.length > 20 ? `${selector.substring(0, 20)}...` : selector}
            </Badge>
          ))}
          {selectors.length > 3 && (
            <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setShowAllSelectors(true)}>
              +{selectors.length - 3} محدد آخر
            </Badge>
          )}
        </div>
      )}

      {selectors.length === 0 && (
        <p className="text-xs text-muted-foreground">
          لم يتم إضافة محددات مخصصة بعد. أضف محددات CSS للعثور على عنصر السعر في الصفحة.
        </p>
      )}
    </div>
  );
};
