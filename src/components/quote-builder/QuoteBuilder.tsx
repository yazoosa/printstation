import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { usePrintPricingStore } from '../../store/printPricingStore';
import { useSheetSizesStore } from '../../store/sheetSizesStore';
import { usePaperStore } from '../../store/paperStore';
import { useComplexityStore } from '../../store/complexityStore';
import { useSetupFeesStore } from '../../store/setupFeesStore';
import { useQuoteBuilderStore } from '../../store/quoteBuilderStore';
import { QuoteForm } from './QuoteForm';
import { LayoutCalculations } from './LayoutCalculations';
import { PricingCalculations } from './PricingCalculations';
import { FinishingOptionsSection } from './FinishingOptionsSection';
import { FinishingCalculations } from './FinishingCalculations';
import { GrandTotalActions } from './GrandTotalActions';
import { calculateVATFromTotal } from '../../lib/utils';
import type { 
  LayoutResult, 
  PricingCalculation, 
  FinishingRow,
  PaperCatalog,
  PrintColour,
  Complexity,
  PaperSize
} from './types';

export function QuoteBuilder() {
  // Store hooks
  const { printPrices, fetchPrintPrices, loading: printLoading } = usePrintPricingStore();
  const { sheetSizes, fetchSheetSizes, loading: sizesLoading } = useSheetSizesStore();
  const { papers, fetchPapers, loading: papersLoading } = usePaperStore();
  const { complexities, fetchComplexities } = useComplexityStore();
  const { setupFees: setupFeesData, fetchSetupFees } = useSetupFeesStore();
  const { 
    setLayoutResult: setStoreLayoutResult, 
    setSheetsRequired: setStoreSheetsRequired,
    setSelectedSheetSize: setStoreSheetSize,
    setQuantity: setStoreQuantity 
  } = useQuoteBuilderStore();

  // Form state
  const [selectedSheetSize, setSelectedSheetSize] = useState<string>('SRA3');
  const [selectedPreDefinedSize, setSelectedPreDefinedSize] = useState<string>('A3');
  const [width, setWidth] = useState<number>(297);
  const [length, setLength] = useState<number>(420);
  const [bleed, setBleed] = useState<number>(3);
  const [gutter, setGutter] = useState<number>(0);
  const [selectedPaperType, setSelectedPaperType] = useState<string>('');
  const [selectedPaper, setSelectedPaper] = useState<string>('');
  const [selectedPrint, setSelectedPrint] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(100);
  // Calculation state
  const [layoutResult, setLayoutResult] = useState<LayoutResult | null>(null);
  const [sheetsRequired, setSheetsRequired] = useState<number>(0);
  const [pricingCalculation, setPricingCalculation] = useState<PricingCalculation | null>(null);
  const [finishingRows, setFinishingRows] = useState<FinishingRow[]>([]);

  // Fetch initial data
  useEffect(() => {
    fetchPrintPrices();
    fetchSheetSizes();
    fetchPapers();
    fetchComplexities();
    fetchSetupFees();
  }, [fetchPrintPrices, fetchSheetSizes, fetchPapers, fetchComplexities, fetchSetupFees]);

  // Derived values
  const sheetSizeOptions = Array.from(new Set(printPrices.map((p: PrintColour) => p.size)));
  const paperTypes = Array.from(new Set(papers.map((p: PaperCatalog) => p.type)));
  const paperOptions = papers
    .filter((p: PaperCatalog) => p.type === selectedPaperType)
    .map((p: PaperCatalog) => ({
      value: p.id,
      label: `${p.name} ${p.grammage}gsm`
    }));

  // Set initial values
  useEffect(() => {
    if (paperTypes.length > 0 && !selectedPaperType) {
      const defaultType = paperTypes.includes('Coated') ? 'Coated' : paperTypes[0];
      setSelectedPaperType(defaultType);
    }
  }, [paperTypes, selectedPaperType]);

  useEffect(() => {
    if (selectedPaperType) {
      const filteredPapers = papers.filter((p: PaperCatalog) => p.type === selectedPaperType);
      if (filteredPapers.length > 0) {
        setSelectedPaper(filteredPapers[0].id);
      }
    }
  }, [selectedPaperType, papers]);

  // Update dimensions when pre-defined size changes
  useEffect(() => {
    const selectedSize = sheetSizes.find((s: PaperSize) => s.name === selectedPreDefinedSize);
    if (selectedSize) {
      setWidth(selectedSize.width);
      setLength(selectedSize.length);
    }
  }, [selectedPreDefinedSize, sheetSizes]);

  // Calculate layout
useEffect(() => {
  const selectedPriceConfig = printPrices.find((p: PrintColour) => p.size === selectedSheetSize);
  if (selectedPriceConfig && width && length) {
    // Add bleed to dimensions
    const totalWidth = width + (bleed * 2);
    const totalLength = length + (bleed * 2);

    // Calculate fits for both orientations
    const portraitAcross = Math.floor(selectedPriceConfig.width / (totalWidth + gutter));
    const portraitDown = Math.floor(selectedPriceConfig.length / (totalLength + gutter));
    const portraitTotal = portraitAcross * portraitDown;

    const landscapeAcross = Math.floor(selectedPriceConfig.width / (totalLength + gutter));
    const landscapeDown = Math.floor(selectedPriceConfig.length / (totalWidth + gutter));
    const landscapeTotal = landscapeAcross * landscapeDown;

    // Choose the better orientation
    if (landscapeTotal > portraitTotal) {
      const result = {
        repeats: landscapeTotal,
        across: landscapeAcross,
        down: landscapeDown,
        isLandscape: true
      };
      setLayoutResult(result);
      setStoreLayoutResult(result);
    } else {
      const result = {
        repeats: portraitTotal,
        across: portraitAcross,
        down: portraitDown,
        isLandscape: false
      };
      setLayoutResult(result);
      setStoreLayoutResult(result);
    }

    // Calculate sheets required
    if (quantity > 0) {
      const sheets = Math.ceil(quantity / Math.max(portraitTotal, landscapeTotal));
      setSheetsRequired(sheets);
      setStoreSheetsRequired(sheets);
    }
  }
}, [
  selectedSheetSize,
  width,
  length,
  bleed,
  gutter,
  printPrices,
  quantity,
  setStoreLayoutResult,
  setStoreSheetsRequired
]);
  // Calculate pricing
  useEffect(() => {
    if (!layoutResult || !sheetsRequired) return;

    const selectedPriceConfig = printPrices.find((p: PrintColour) => p.size === selectedSheetSize);
    const selectedPaperConfig = papers.find((p: PaperCatalog) => p.id === selectedPaper);
    
    if (!selectedPriceConfig || !selectedPaperConfig) return;

    // 1. Calculate Paper Cost
    const paperCost = sheetsRequired * selectedPaperConfig.price;

    // 2. Calculate Printing Cost
    let printingPrice = 0;
    switch (selectedPrint) {
      case 'fc_ss':
        printingPrice = selectedPriceConfig.fc_ss_price;
        break;
      case 'fc_ds':
        printingPrice = selectedPriceConfig.fc_ds_price;
        break;
      case 'bw_ss':
        printingPrice = selectedPriceConfig.bw_ss_price;
        break;
      case 'bw_ds':
        printingPrice = selectedPriceConfig.bw_ds_price;
        break;
      case 'fc_bw':
        printingPrice = selectedPriceConfig.fc_bw_price;
        break;
    }
    const printingBaseCost = sheetsRequired * printingPrice;

    // Get setup fee based on sheets required
    let setupFee = 0;
    if (setupFeesData) {
      // Find the closest quantity bracket for sheets required
      const quantities = Object.keys(setupFeesData)
        .filter(key => !['id', 'created_at'].includes(key))
        .map(Number)
        .sort((a, b) => a - b);

      let closestQuantity = quantities[0];
      for (const qty of quantities) {
        if (qty <= sheetsRequired) {
          closestQuantity = qty;
        } else {
          break;
        }
      }
      setupFee = Number(setupFeesData[closestQuantity]) || 0;
    }

    const totalPrintingCost = printingBaseCost + setupFee;

    // 3. Calculate Complexity Factor
    const complexityPercentage = complexities
      .filter((c: Complexity) => c.breakpoint <= layoutResult.repeats)
      .sort((a, b) => b.breakpoint - a.breakpoint)[0]?.percent || 0;

    const complexityFactor = ((paperCost + totalPrintingCost) * complexityPercentage) / 100;

    // 4. Calculate Total
    const total = paperCost + totalPrintingCost + complexityFactor;

    setPricingCalculation({
      paperCost,
      printingBaseCost,
      setupFee,
      totalPrintingCost,
      complexityFactor,
      total,
    });
  }, [
    layoutResult,
    sheetsRequired,
    selectedSheetSize,
    selectedPaper,
    selectedPrint,
    printPrices,
    papers,
    complexities,
    setupFeesData
  ]);

  const selectedPriceConfig = printPrices.find((p: PrintColour) => p.size === selectedSheetSize);
  
  // Wrap printOptions in useMemo
  const printOptions = useMemo(() => {
    if (!selectedPriceConfig) return [];
    return [
      { value: 'fc_ss', label: 'Full Color Single Sided', price: selectedPriceConfig.fc_ss_price },
      { value: 'fc_ds', label: 'Full Color Double Sided', price: selectedPriceConfig.fc_ds_price },
      { value: 'bw_ss', label: 'Black & White Single Sided', price: selectedPriceConfig.bw_ss_price },
      { value: 'bw_ds', label: 'Black & White Double Sided', price: selectedPriceConfig.bw_ds_price },
      { value: 'fc_bw', label: 'Full Color + Black & White', price: selectedPriceConfig.fc_bw_price },
    ];
  }, [selectedPriceConfig]);

  // Set initial print option
  useEffect(() => {
    if (printOptions.length > 0 && !selectedPrint) {
      setSelectedPrint(printOptions[0].value);
    }
  }, [printOptions, selectedPrint]);

  const selectedPaperConfig = papers.find((p: PaperCatalog) => p.id === selectedPaper);
  const printOptionLabel = printOptions.find(opt => opt.value === selectedPrint)?.label || '';

  const grandTotal = (pricingCalculation?.total || 0) + 
    finishingRows.reduce((sum, row) => sum + row.setupFee + (row.quantity * row.price), 0);

  const { subtotal, vat } = calculateVATFromTotal(grandTotal);

  if (printLoading || sizesLoading || papersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <QuoteForm
          sheetSizeOptions={sheetSizeOptions}
          selectedSheetSize={selectedSheetSize}
          setSelectedSheetSize={(size) => {
            setSelectedSheetSize(size);
            setStoreSheetSize(size);
          }}
          sheetSizes={sheetSizes}
          selectedPreDefinedSize={selectedPreDefinedSize}
          setSelectedPreDefinedSize={setSelectedPreDefinedSize}
          width={width}
          setWidth={setWidth}
          length={length}
          setLength={setLength}
          bleed={bleed}
          setBleed={setBleed}
          gutter={gutter}
          setGutter={setGutter}
          paperTypes={paperTypes}
          selectedPaperType={selectedPaperType}
          setSelectedPaperType={setSelectedPaperType}
          paperOptions={paperOptions}
          selectedPaper={selectedPaper}
          setSelectedPaper={setSelectedPaper}
          printOptions={printOptions}
          selectedPrint={selectedPrint}
          setSelectedPrint={setSelectedPrint}
          quantity={quantity}
          setQuantity={(qty) => {
            setQuantity(qty);
            setStoreQuantity(qty);
          }}
        />

        <LayoutCalculations
          layoutResult={layoutResult}
          sheetsRequired={sheetsRequired}
          quantity={quantity}
          selectedSheetSize={selectedSheetSize}
        />

        <PricingCalculations
          pricingCalculation={pricingCalculation}
          quantity={quantity}
        />

        <FinishingOptionsSection
          defaultQuantity={quantity}
          sheetsRequired={sheetsRequired}
          onRowsChange={setFinishingRows}
        />

        <FinishingCalculations
          rows={finishingRows}
          pricingTotal={pricingCalculation?.total || 0}
          quoteQuantity={quantity}
        />

        <GrandTotalActions
          quantity={quantity}
          width={width}
          length={length}
          selectedPaper={selectedPaperConfig}
          selectedPrintOption={printOptionLabel}
          finishingOptions={finishingRows}
          subtotal={subtotal}
          vat={vat}
          grandTotal={grandTotal}
        />
      </CardContent>
    </Card>
  );
}