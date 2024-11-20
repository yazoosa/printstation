import { useEffect, useState } from 'react';
import { useFinishingOptionsStore } from '@/store/finishingOptionsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Minus } from 'lucide-react';

interface FinishingRow {
  id: string;
  category: string;
  subCategory: string;
  setupFee: number;
  quantity: number;
  price: number;
}

interface FinishingOptionsSectionProps {
  defaultQuantity: number;
  sheetsRequired: number;
  onRowsChange: (rows: FinishingRow[]) => void;
}

const SHEET_BASED_CATEGORIES = ['Die Machine', 'Pouch Lamination', 'OPP Lamination'];

export function FinishingOptionsSection({ 
  defaultQuantity,
  sheetsRequired,
  onRowsChange
}: FinishingOptionsSectionProps) {
  const { options, fetchOptions } = useFinishingOptionsStore();
  const [rows, setRows] = useState<FinishingRow[]>([{
    id: '1',
    category: '',
    subCategory: '',
    setupFee: 0,
    quantity: defaultQuantity,
    price: 0
  }]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // Update rows when defaultQuantity or sheetsRequired changes
  useEffect(() => {
    setRows(currentRows => 
      currentRows.map(row => ({
        ...row,
        quantity: SHEET_BASED_CATEGORIES.includes(row.category) ? sheetsRequired : defaultQuantity
      }))
    );
  }, [defaultQuantity, sheetsRequired]);

  // Notify parent of rows changes
  useEffect(() => {
    onRowsChange(rows);
  }, [rows, onRowsChange]);

  const uniqueCategories = Array.from(new Set(options.map(opt => opt.category)));

  const getSubCategories = (category: string) => 
    options.filter(opt => opt.category === category).map(opt => opt.sub_category);

  const handleCategoryChange = (value: string, index: number) => {
    const newRows = [...rows];
    const row = newRows[index];
    row.category = value;
    row.subCategory = '';
    row.setupFee = 0;
    row.price = 0;
    // Set initial quantity based on category
    row.quantity = SHEET_BASED_CATEGORIES.includes(value) ? sheetsRequired : defaultQuantity;
    setRows(newRows);
  };

  const handleSubCategoryChange = (value: string, index: number) => {
    const newRows = [...rows];
    const row = newRows[index];
    const option = options.find(opt => 
      opt.category === row.category && opt.sub_category === value
    );
    if (option) {
      row.subCategory = value;
      row.setupFee = option.setup_fee;
      row.price = option.price;
    }
    setRows(newRows);
  };

  const handleQuantityChange = (value: number, index: number) => {
    const newRows = [...rows];
    newRows[index].quantity = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, {
      id: (rows.length + 1).toString(),
      category: '',
      subCategory: '',
      setupFee: 0,
      quantity: defaultQuantity,
      price: 0
    }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  return (
    <>
      <Separator />
      <div className="grid gap-3">
        <h3 className="text-lg font-semibold">Finishing Options</h3>
        
        <div className="space-y-4">
          {rows.map((row, index) => (
            <div key={row.id} className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-3 space-y-1.5">
                <Label className="text-sm">Category</Label>
                <Select
                  value={row.category}
                  onValueChange={(value) => handleCategoryChange(value, index)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-3 space-y-1.5">
                <Label className="text-sm">Description</Label>
                <Select
                  value={row.subCategory}
                  onValueChange={(value) => handleSubCategoryChange(value, index)}
                  disabled={!row.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select description" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubCategories(row.category).map((subCategory) => (
                      <SelectItem key={subCategory} value={subCategory}>
                        {subCategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label className="text-sm">Setup Fee</Label>
                <Input
                  type="number"
                  value={row.setupFee}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label className="text-sm">Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value), index)}
                />
              </div>

              <div className="col-span-1 space-y-1.5">
                <Label className="text-sm">Price</Label>
                <Input
                  type="number"
                  value={row.price}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="col-span-1 flex gap-2">
                {index === rows.length - 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={addRow}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                {rows.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeRow(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}