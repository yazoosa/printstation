import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

interface LayoutResult {
  repeats: number;
  across: number;
  down: number;
  isLandscape: boolean;
}

interface LayoutCalculationsProps {
  layoutResult: LayoutResult | null;
  sheetsRequired: number;
  selectedSheetSize: string;
}

export function LayoutCalculations({ 
  layoutResult, 
  sheetsRequired,
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
              {layoutResult ? `${sheetsRequired} Sheets` : '-'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
