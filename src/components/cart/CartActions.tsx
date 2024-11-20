import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';

interface CartActionsProps {
  onSave: () => void;
  onClear: () => void;
}

export function CartActions({ onSave, onClear }: CartActionsProps) {
  return (
    <div className="flex gap-3">
      <Button variant="outline" onClick={onSave}>
        <Save className="h-4 w-4 mr-2" />
        Save Cart
      </Button>
      <Button variant="destructive" onClick={onClear}>
        <Trash2 className="h-4 w-4 mr-2" />
        Empty Cart
      </Button>
    </div>
  );
}