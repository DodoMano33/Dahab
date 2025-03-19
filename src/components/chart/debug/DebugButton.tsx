
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DebugButton: React.FC = () => {
  return (
    <Link to="/debug-image">
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Bug size={16} />
        <span>صفحة فحص الصور</span>
      </Button>
    </Link>
  );
};
