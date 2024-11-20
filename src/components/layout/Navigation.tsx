import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator, FileText, Settings, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export function Navigation() {
  const { items } = useCartStore();

  return (
    <header className="border-b">
      <div className="max-w-[1280px] mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Quote Builder
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link to="/">
                <Calculator className="h-4 w-4 mr-2" />
                Quote Builder
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/quotes">
                <FileText className="h-4 w-4 mr-2" />
                Saved Quotes
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart {items.length > 0 && `(${items.length})`}
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}