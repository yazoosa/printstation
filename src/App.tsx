import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { QuoteBuilder } from '@/components/quote-builder/QuoteBuilder';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { Cart } from '@/components/cart/Cart';
import { SavedQuotes } from '@/components/saved-quotes/SavedQuotes';
import { ThemeProvider } from '@/components/theme-provider';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="max-w-[1280px] mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<QuoteBuilder />} />
              <Route path="/quotes" element={<SavedQuotes />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/settings" element={<SettingsLayout />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}