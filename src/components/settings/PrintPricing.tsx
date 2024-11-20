import { useEffect, useState, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { usePrintPricingStore } from '../../store/printPricingStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Pencil, Plus, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import type { PrintColour } from '../../types/database.types';

interface PriceFormProps<T> {
  price: Partial<PrintColour>;
  onSubmit: () => Promise<void>;
  isNew?: boolean;
  loading: boolean;
  setPrice: Dispatch<SetStateAction<T>>;
}

const PriceForm = <T extends Partial<PrintColour> | PrintColour | null>({ 
  price, 
  onSubmit, 
  isNew = false, 
  loading, 
  setPrice 
}: PriceFormProps<T>) => (
  <div className="grid gap-4">
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Input
          id="size"
          value={price.size || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPrice((prev: any) => ({ ...(prev || {}), size: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="width">Width (mm)</Label>
        <Input
          id="width"
          type="number"
          value={price.width || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPrice((prev: any) => ({ ...(prev || {}), width: Number(e.target.value) }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="length">Length (mm)</Label>
        <Input
          id="length"
          type="number"
          value={price.length || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPrice((prev: any) => ({ ...(prev || {}), length: Number(e.target.value) }))
          }
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Full Color Single Sided</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="fc_ss_cost" className="text-xs">Cost</Label>
            <Input
              id="fc_ss_cost"
              type="number"
              step="0.01"
              value={price.fc_ss_cost || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice((prev: any) => ({ ...(prev || {}), fc_ss_cost: Number(e.target.value) }))
              }
            />
          </div>
          <div>
            <Label htmlFor="fc_ss_price" className="text-xs">Price</Label>
            <Input
              id="fc_ss_price"
              type="number"
              step="0.01"
              value={price.fc_ss_price || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice((prev: any) => ({ ...(prev || {}), fc_ss_price: Number(e.target.value) }))
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Full Color Double Sided</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="fc_ds_cost" className="text-xs">Cost</Label>
            <Input
              id="fc_ds_cost"
              type="number"
              step="0.01"
              value={price.fc_ds_cost || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice((prev: any) => ({ ...(prev || {}), fc_ds_cost: Number(e.target.value) }))
              }
            />
          </div>
          <div>
            <Label htmlFor="fc_ds_price" className="text-xs">Price</Label>
            <Input
              id="fc_ds_price"
              type="number"
              step="0.01"
              value={price.fc_ds_price || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice((prev: any) => ({ ...(prev || {}), fc_ds_price: Number(e.target.value) }))
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Black & White Single Sided</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="bw_ss_cost" className="text-xs">Cost</Label>
            <Input
              id="bw_ss_cost"
              type="number"
              step="0.01"
              value={price.bw_ss_cost || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice((prev: any) => ({ ...(prev || {}), bw_ss_cost: Number(e.target.value) }))
              }
            />
          </div>
          <div>
            <Label htmlFor="bw_ss_price" className="text-xs">Price</Label>
            <Input
              id="bw_ss_price"
              type="number"
              step="0.01"
              value={price.bw_ss_price || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice((prev: any) => ({ ...(prev || {}), bw_ss_price: Number(e.target.value) }))
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Black & White Double Sided</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="bw_ds_cost" className="text-xs">Cost</Label>
            <Input
              id="bw_ds_cost"
              type="number"
              step="0.01"
              value={price.bw_ds_cost || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice((prev: any) => ({ ...(prev || {}), bw_ds_cost: Number(e.target.value) }))
              }
            />
          </div>
          <div>
            <Label htmlFor="bw_ds_price" className="text-xs">Price</Label>
            <Input
              id="bw_ds_price"
              type="number"
              step="0.01"
              value={price.bw_ds_price || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice((prev: any) => ({ ...(prev || {}), bw_ds_price: Number(e.target.value) }))
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Full Color + Black & White</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="fc_bw_cost" className="text-xs">Cost</Label>
            <Input
              id="fc_bw_cost"
              type="number"
              step="0.01"
              value={price.fc_bw_cost || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice((prev: any) => ({ ...(prev || {}), fc_bw_cost: Number(e.target.value) }))
              }
            />
          </div>
          <div>
            <Label htmlFor="fc_bw_price" className="text-xs">Price</Label>
            <Input
              id="fc_bw_price"
              type="number"
              step="0.01"
              value={price.fc_bw_price || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice((prev: any) => ({ ...(prev || {}), fc_bw_price: Number(e.target.value) }))
              }
            />
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-end">
      <Button onClick={onSubmit} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {isNew ? 'Add Price' : 'Update Price'}
      </Button>
    </div>
  </div>
);

export function PrintPricing() {
  const { printPrices, loading, error, fetchPrintPrices, addPrintPrice, updatePrintPrice, deletePrintPrice } =
    usePrintPricingStore();
  const [editingPrice, setEditingPrice] = useState<PrintColour | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPrice, setNewPrice] = useState<Partial<PrintColour>>({
    size: '',
    width: 0,
    length: 0,
    fc_ss_cost: 0,
    fc_ss_price: 0,
    fc_ds_cost: 0,
    fc_ds_price: 0,
    bw_ss_cost: 0,
    bw_ss_price: 0,
    bw_ds_cost: 0,
    bw_ds_price: 0,
    fc_bw_cost: 0,
    fc_bw_price: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPrintPrices();
  }, [fetchPrintPrices]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleAdd = async () => {
    try {
      await addPrintPrice(newPrice as Omit<PrintColour, 'id' | 'created_at'>);
      setIsDialogOpen(false);
      setNewPrice({
        size: '',
        width: 0,
        length: 0,
        fc_ss_cost: 0,
        fc_ss_price: 0,
        fc_ds_cost: 0,
        fc_ds_price: 0,
        bw_ss_cost: 0,
        bw_ss_price: 0,
        bw_ds_cost: 0,
        bw_ds_price: 0,
        fc_bw_cost: 0,
        fc_bw_price: 0,
      });
      toast({
        title: 'Success',
        description: 'Print price added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add print price',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingPrice?.id) return;

    try {
      await updatePrintPrice(editingPrice.id, editingPrice);
      setIsDialogOpen(false);
      setEditingPrice(null);
      toast({
        title: 'Success',
        description: 'Print price updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update print price',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePrintPrice(id);
      toast({
        title: 'Success',
        description: 'Print price deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete print price',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (price: PrintColour) => {
    setEditingPrice({ ...price });
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Print Pricing</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingPrice(null);
                setNewPrice({
                  size: '',
                  width: 0,
                  length: 0,
                  fc_ss_cost: 0,
                  fc_ss_price: 0,
                  fc_ds_cost: 0,
                  fc_ds_price: 0,
                  bw_ss_cost: 0,
                  bw_ss_price: 0,
                  bw_ds_cost: 0,
                  bw_ds_price: 0,
                  fc_bw_cost: 0,
                  fc_bw_price: 0,
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Price
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{editingPrice ? 'Edit Print Price' : 'Add New Print Price'}</DialogTitle>
              </DialogHeader>
              {editingPrice ? (
                <PriceForm<PrintColour | null>
                  price={editingPrice}
                  onSubmit={handleUpdate}
                  loading={loading}
                  setPrice={setEditingPrice}
                />
              ) : (
                <PriceForm<Partial<PrintColour>>
                  price={newPrice}
                  onSubmit={handleAdd}
                  isNew
                  loading={loading}
                  setPrice={setNewPrice}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>Full Color SS</TableHead>
              <TableHead>Full Color DS</TableHead>
              <TableHead>B&W SS</TableHead>
              <TableHead>B&W DS</TableHead>
              <TableHead>FC + B&W</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {printPrices.map((price) => (
              <TableRow key={price.id}>
                <TableCell>{price.size}</TableCell>
                <TableCell>{price.width}x{price.length}mm</TableCell>
                <TableCell>R{price.fc_ss_price.toFixed(2)}</TableCell>
                <TableCell>R{price.fc_ds_price.toFixed(2)}</TableCell>
                <TableCell>R{price.bw_ss_price.toFixed(2)}</TableCell>
                <TableCell>R{price.bw_ds_price.toFixed(2)}</TableCell>
                <TableCell>R{price.fc_bw_price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(price)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(price.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
