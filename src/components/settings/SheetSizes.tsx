import { useEffect, useState } from 'react';
import { useSheetSizesStore } from '@/store/sheetSizesStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Plus, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { PaperSize } from '@/types/database.types';

interface SizeFormData {
  name: string;
  width: number;
  length: number;
  display_order: number;
}

interface SizeFormProps {
  size: SizeFormData;
  onSubmit: () => Promise<void>;
  isNew?: boolean;
  loading: boolean;
  setSize: (size: SizeFormData) => void;
}

const SizeForm = ({ size, onSubmit, isNew = false, loading, setSize }: SizeFormProps) => (
  <div className="grid gap-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={size.name}
          onChange={(e) =>
            setSize({ ...size, name: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="display_order">Display Order</Label>
        <Input
          id="display_order"
          type="number"
          value={size.display_order}
          onChange={(e) =>
            setSize({ ...size, display_order: Number(e.target.value) })
          }
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="width">Width (mm)</Label>
        <Input
          id="width"
          type="number"
          value={size.width}
          onChange={(e) =>
            setSize({ ...size, width: Number(e.target.value) })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="length">Length (mm)</Label>
        <Input
          id="length"
          type="number"
          value={size.length}
          onChange={(e) =>
            setSize({ ...size, length: Number(e.target.value) })
          }
        />
      </div>
    </div>
    <div className="flex justify-end">
      <Button onClick={onSubmit} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {isNew ? 'Add Size' : 'Update Size'}
      </Button>
    </div>
  </div>
);

export function SheetSizes() {
  const { sheetSizes, loading, error, fetchSheetSizes, addSheetSize, updateSheetSize, deleteSheetSize } =
    useSheetSizesStore();
  const [editingSize, setEditingSize] = useState<PaperSize | null>(null);
  const [editingFormData, setEditingFormData] = useState<SizeFormData>({
    name: '',
    width: 0,
    length: 0,
    display_order: 0,
  });
  const [newSize, setNewSize] = useState<SizeFormData>({
    name: '',
    width: 0,
    length: 0,
    display_order: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSheetSizes();
  }, [fetchSheetSizes]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Update form data when editing size changes
  useEffect(() => {
    if (editingSize) {
      setEditingFormData({
        name: editingSize.name,
        width: editingSize.width,
        length: editingSize.length,
        display_order: editingSize.display_order,
      });
    }
  }, [editingSize]);

  const handleAdd = async () => {
    await addSheetSize({
      type: 'Pre-Defined Size',
      ...newSize,
    });
    if (!error) {
      toast({
        title: 'Success',
        description: 'Sheet size added successfully',
      });
    }
  };

  const handleUpdate = async () => {
    if (editingSize) {
      await updateSheetSize(editingSize.id, {
        ...editingSize,
        ...editingFormData,
      });
      if (!error) {
        setEditingSize(null);
        toast({
          title: 'Success',
          description: 'Sheet size updated successfully',
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSheetSize(id);
    if (!error) {
      toast({
        title: 'Success',
        description: 'Sheet size deleted successfully',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sheet Sizes</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Size
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Sheet Size</DialogTitle>
              </DialogHeader>
              <SizeForm 
                size={newSize} 
                onSubmit={handleAdd} 
                isNew={true}
                loading={loading}
                setSize={setNewSize}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>Display Order</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sheetSizes.map((size) => (
              <TableRow key={size.id}>
                <TableCell>{size.name}</TableCell>
                <TableCell>{size.width}x{size.length}mm</TableCell>
                <TableCell>{size.display_order}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingSize(size)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Sheet Size</DialogTitle>
                        </DialogHeader>
                        <SizeForm
                          size={editingFormData}
                          onSubmit={handleUpdate}
                          isNew={false}
                          loading={loading}
                          setSize={setEditingFormData}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(size.id)}
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