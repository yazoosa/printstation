import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { roundToNearestFive } from "./utils/calculations";

interface PricingCalculation {
  paperCost: number;
  printingBaseCost: number;
  setupFee: number;
  totalPrintingCost: number;
  complexityFactor: number;
  total: number;
}

interface PricingCalculationsProps {
  pricingCalculation: PricingCalculation | null;
  quantity: number;
}

export function PricingCalculations({ pricingCalculation, quantity }: PricingCalculationsProps) {
  if (!pricingCalculation) return null;

  const roundedTotal = roundToNearestFive(pricingCalculation.total);
  const costPerUnit = quantity > 0 ? roundedTotal / quantity : 0;

  return (
    <>
      <Separator />
      <div className="grid gap-3">
        <h3 className="text-lg font-semibold">Pricing Calculations</h3>
        
        <div className="grid grid-cols-6 gap-3">
          {/* First Row - Costs */}
          <div className="col-span-3 grid grid-cols-3 gap-3">
            <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
              <Label className="text-xs text-muted-foreground">Paper</Label>
              <p className="font-semibold">R{pricingCalculation.paperCost.toFixed(2)}</p>
            </div>

            <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
              <Label className="text-xs text-muted-foreground">Printing</Label>
              <p className="font-semibold">R{pricingCalculation.printingBaseCost.toFixed(2)}</p>
            </div>

            <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
              <Label className="text-xs text-muted-foreground">Setup Fee</Label>
              <p className="font-semibold">R{pricingCalculation.setupFee.toFixed(2)}</p>
            </div>
          </div>

          {/* Second Row - Complexity and Totals */}
          <div className="col-span-3 grid grid-cols-3 gap-3">
            <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
              <Label className="text-xs text-muted-foreground">Complexity Fee</Label>
              <p className="font-semibold">R{pricingCalculation.complexityFactor.toFixed(2)}</p>
            </div>

            <div className="space-y-1 p-3 bg-primary/10 rounded-lg">
              <Label className="text-xs font-medium">Total</Label>
              <p className="font-bold">R{roundedTotal.toFixed(2)}</p>
            </div>

            <div className="space-y-1 p-3 bg-primary/10 rounded-lg">
              <Label className="text-xs font-medium">Per Unit</Label>
              <p className="font-bold">R{costPerUnit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}