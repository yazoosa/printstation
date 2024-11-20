import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { roundToNearestFive } from "./utils/calculations";

interface FinishingRow {
  id: string;
  category: string;
  subCategory: string;
  setupFee: number;
  quantity: number;
  price: number;
}

interface FinishingCalculationsProps {
  rows: FinishingRow[];
  pricingTotal: number;
  quoteQuantity: number; // Add this prop
}

export function FinishingCalculations({ rows, pricingTotal, quoteQuantity }: FinishingCalculationsProps) {
  // Calculate finishing total
  const finishingTotal = rows.reduce((total, row) => {
    return total + row.setupFee + (row.quantity * row.price);
  }, 0);

  // Calculate grand total
  const grandTotal = roundToNearestFive(pricingTotal + finishingTotal);
  const costPerUnit = quoteQuantity > 0 ? grandTotal / quoteQuantity : 0;

  return (
    <>
      <Separator />
      <div className="grid gap-3">
        <h3 className="text-lg font-semibold">Grand Total Summary</h3>
        
        <div className="grid grid-cols-6 gap-3">
          {/* First Row - Totals */}
          <div className="col-span-3 grid grid-cols-2 gap-3">
            <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
              <Label className="text-xs text-muted-foreground">Pricing Total</Label>
              <p className="font-semibold">R{pricingTotal.toFixed(2)}</p>
            </div>

            <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
              <Label className="text-xs text-muted-foreground">Finishing Total</Label>
              <p className="font-semibold">R{finishingTotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Second Row - Grand Total and Cost Per Unit */}
          <div className="col-span-3 grid grid-cols-2 gap-3">
            <div className="space-y-1 p-3 bg-primary/10 rounded-lg">
              <Label className="text-xs font-medium">GRAND TOTAL</Label>
              <p className="font-bold">R{grandTotal.toFixed(2)}</p>
            </div>

            <div className="space-y-1 p-3 bg-primary/10 rounded-lg">
              <Label className="text-xs font-medium">Cost Per Unit</Label>
              <p className="font-bold">R{costPerUnit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}