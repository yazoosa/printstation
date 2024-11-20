import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';
import { roundToNearestFive } from './utils/calculations';
import type { GrandTotalActionsProps } from './types';

export function GrandTotalActions({
  quantity,
  width,
  length,
  selectedPaper,
  selectedPrintOption,
  finishingOptions,
  grandTotal
}: GrandTotalActionsProps) {
  const navigate = useNavigate();
  const { items, addItem } = useCartStore();
  const { toast } = useToast();

  const formatItemDescription = () => {
    const lines = [
      `Qty: ${quantity}`,
      `Size: ${width} x ${length}mm`,
      `Paper: ${selectedPaper ? `${selectedPaper.name} ${selectedPaper.grammage}gsm` : 'Not selected'}`,
      `Print: ${selectedPrintOption}`
    ];

    if (finishingOptions.length > 0) {
      lines.push('', 'Finishing Options:');
      finishingOptions.forEach(opt => {
        const description = `${opt.category} - ${opt.subCategory}`;
        if (opt.quantity !== quantity) {
          lines.push(`- ${description} (Qty: ${opt.quantity})`);
        } else {
          lines.push(`- ${description}`);
        }
      });
    }

    return lines.join('\n');
  };

  const handleAddToCart = () => {
    // Round the price before adding to cart
    const roundedPrice = roundToNearestFive(grandTotal);
    
    addItem({
      description: formatItemDescription(),
      price: roundedPrice,
      quantity: 1,
      total: roundedPrice,
    });

    toast({
      title: 'Success',
      description: 'Item added to cart successfully',
    });
  };

  return (
    <div className="flex gap-3">
      <Button onClick={handleAddToCart} className="flex-1">
        <ShoppingCart className="h-4 w-4 mr-2" />
        Add to Cart
      </Button>
      <Button variant="outline" onClick={() => navigate('/cart')}>
        <Eye className="h-4 w-4 mr-2" />
        View Cart ({items.length})
      </Button>
    </div>
  );
}