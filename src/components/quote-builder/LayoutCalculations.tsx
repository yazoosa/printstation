import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface LayoutResult {
  repeats: number;
  across: number;
  down: number;
  isLandscape: boolean;
}

interface LayoutCalculationsProps {
  layoutResult: LayoutResult | null;
  sheetsRequired: number;
  quantity: number;
  selectedSheetSize: string;
}

export function LayoutCalculations({ 
  layoutResult, 
  sheetsRequired, 
  quantity, 
  selectedSheetSize 
}: LayoutCalculationsProps) {
  return (
    <>
      <Separator />
      <div className="grid gap-3">
        <h3 className="text-lg font-semibold">Layout Calculations</h3>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Optimal Layout</Label>
            <p className="font-medium">
              {layoutResult ? `${layoutResult.repeats} repeats per ${selectedSheetSize}` : '-'}
            </p>
          </div>

          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Layout</Label>
            <p className="font-medium">
              {layoutResult
                ? `${layoutResult.across} across × ${layoutResult.down} down - ${
                    layoutResult.isLandscape ? 'Landscape' : 'Portrait'
                  }`
                : '-'}
            </p>
          </div>

          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Sheets Required</Label>
            <p className="font-medium">
              {layoutResult ? `${sheetsRequired} sheets for ${quantity} units` : '-'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}