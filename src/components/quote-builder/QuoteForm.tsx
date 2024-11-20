import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaperSize } from "@/types/database.types";

interface QuoteFormProps {
  sheetSizeOptions: string[];
  selectedSheetSize: string;
  setSelectedSheetSize: (value: string) => void;
  sheetSizes: PaperSize[];
  selectedPreDefinedSize: string;
  setSelectedPreDefinedSize: (value: string) => void;
  width: number;
  setWidth: (value: number) => void;
  length: number;
  setLength: (value: number) => void;
  bleed: number;
  setBleed: (value: number) => void;
  gutter: number;
  setGutter: (value: number) => void;
  paperTypes: string[];
  selectedPaperType: string;
  setSelectedPaperType: (value: string) => void;
  paperOptions: { value: string; label: string; }[];
  selectedPaper: string;
  setSelectedPaper: (value: string) => void;
  printOptions: { value: string; label: string; price: number; }[];
  selectedPrint: string;
  setSelectedPrint: (value: string) => void;
  quantity: number;
  setQuantity: (value: number) => void;
}

export function QuoteForm({
  sheetSizeOptions,
  selectedSheetSize,
  setSelectedSheetSize,
  sheetSizes,
  selectedPreDefinedSize,
  setSelectedPreDefinedSize,
  width,
  setWidth,
  length,
  setLength,
  bleed,
  setBleed,
  gutter,
  setGutter,
  paperTypes,
  selectedPaperType,
  setSelectedPaperType,
  paperOptions,
  selectedPaper,
  setSelectedPaper,
  printOptions,
  selectedPrint,
  setSelectedPrint,
  quantity,
  setQuantity,
}: QuoteFormProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="sheetSize" className="text-sm">Sheet Size</Label>
          <Select value={selectedSheetSize} onValueChange={setSelectedSheetSize}>
            <SelectTrigger id="sheetSize" className="h-9">
              <SelectValue placeholder="Select sheet size" />
            </SelectTrigger>
            <SelectContent>
              {sheetSizeOptions.map((size) => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="preDefinedSize" className="text-sm">Pre-Defined Size</Label>
          <Select value={selectedPreDefinedSize} onValueChange={setSelectedPreDefinedSize}>
            <SelectTrigger id="preDefinedSize" className="h-9">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {sheetSizes.map((size) => (
                <SelectItem key={size.id} value={size.name}>{size.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="width" className="text-sm">Width</Label>
            <Input
              id="width"
              type="number"
              min={20}
              step={1}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="length" className="text-sm">Length</Label>
            <Input
              id="length"
              type="number"
              min={20}
              step={1}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="h-9"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="bleed" className="text-sm">Bleed (mm)</Label>
          <Input
            id="bleed"
            type="number"
            min={0}
            max={6}
            step={1}
            value={bleed}
            onChange={(e) => setBleed(Number(e.target.value))}
            className="h-9"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="gutter" className="text-sm">Gutter (mm)</Label>
          <Input
            id="gutter"
            type="number"
            min={0}
            max={6}
            step={1}
            value={gutter}
            onChange={(e) => setGutter(Number(e.target.value))}
            className="h-9"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="paperType" className="text-sm">Paper Type</Label>
          <Select value={selectedPaperType} onValueChange={setSelectedPaperType}>
            <SelectTrigger id="paperType" className="h-9">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {paperTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="paper" className="text-sm">Paper</Label>
          <Select value={selectedPaper} onValueChange={setSelectedPaper}>
            <SelectTrigger id="paper" className="h-9">
              <SelectValue placeholder="Select paper" />
            </SelectTrigger>
            <SelectContent>
              {paperOptions.map((paper) => (
                <SelectItem key={paper.value} value={paper.value}>
                  {paper.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="print" className="text-sm">Print</Label>
          <Select value={selectedPrint} onValueChange={setSelectedPrint}>
            <SelectTrigger id="print" className="h-9">
              <SelectValue placeholder="Select print option" />
            </SelectTrigger>
            <SelectContent>
              {printOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} - R{option.price.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="quantity" className="text-sm">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="h-9"
          />
        </div>
      </div>
    </div>
  );
}