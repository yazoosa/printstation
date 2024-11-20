import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplexitySettings } from './ComplexitySettings';
import { SetupFees } from '../SetupFees';
import { PaperList } from '../PaperList';
import { PrintPricing } from './PrintPricing';
import { SheetSizes } from './SheetSizes';
import { FinishingOptions } from './FinishingOptions';

export function SettingsLayout() {
  return (
    <div className="max-w-[1280px] mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="complexity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="complexity">Complexity</TabsTrigger>
          <TabsTrigger value="setup-fees">Setup Fees</TabsTrigger>
          <TabsTrigger value="paper-catalog">Paper Catalog</TabsTrigger>
          <TabsTrigger value="print-pricing">Print Pricing</TabsTrigger>
          <TabsTrigger value="sheet-sizes">Sheet Sizes</TabsTrigger>
          <TabsTrigger value="finishing-options">Finishing Options</TabsTrigger>
        </TabsList>
        <TabsContent value="complexity">
          <ComplexitySettings />
        </TabsContent>
        <TabsContent value="setup-fees">
          <SetupFees />
        </TabsContent>
        <TabsContent value="paper-catalog">
          <PaperList />
        </TabsContent>
        <TabsContent value="print-pricing">
          <PrintPricing />
        </TabsContent>
        <TabsContent value="sheet-sizes">
          <SheetSizes />
        </TabsContent>
        <TabsContent value="finishing-options">
          <FinishingOptions />
        </TabsContent>
      </Tabs>
    </div>
  );
}