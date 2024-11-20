import { useEffect, useState } from 'react';
import { useFinishingOptionsStore } from '../../store/finishingOptionsStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { Pencil, Plus, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import type { FinishingOption } from '../../types/database.types';

interface OptionFormProps {
  option: {
    category: string;
    sub_category: string;
    setup_fee: number;
    cost: number;
    price: number;
  };
  onSubmit: () => Promise<void>;
  isNew?: boolean;
  loading: boolean;
  setOption: (option: any) => void;
}

const OptionForm = ({ option, onSubmit, isNew = false, loading, setOption }: OptionFormProps) => (
  <div className="grid gap-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={option.category}
          onChange={(e) =>
            setOption(isNew 
              ? { ...option, category: e.target.value }
              : { ...option, category: e.target.value }
            )
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sub_category">Sub Category</Label>
        <Input
          id="sub_category"
          value={option.sub_category}
          onChange={(e) =>
            setOption(isNew
              ? { ...option, sub_category: e.target.value }
              : { ...option, sub_category: e.target.value }
            )
          }
        />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="setup_fee">Setup Fee</Label>
        <Input
          id="setup_fee"
          type="number"
          step="0.01"
          value={option.setup_fee}
          onChange={(e) =>
            setOption(isNew
              ? { ...option, setup_fee: Number(e.target.value) }
              : { ...option, setup_fee: Number(e.target.value) }
            )
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cost">Cost</Label>
        <Input
          id="cost"
          type="number"
          step="0.01"
          value={option.cost}
          onChange={(e) =>
            setOption(isNew
              ? { ...option, cost: Number(e.target.value) }
              : { ...option, cost: Number(e.target.value) }
            )
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={option.price}
          onChange={(e) =>
            setOption(isNew
              ? { ...option, price: Number(e.target.value) }
              : { ...option, price: Number(e.target.value) }
            )
          }
        />
      </div>
    </div>
    <div className="flex justify-end">
      <Button onClick={onSubmit} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {isNew ? 'Add Option' : 'Update Option'}
      </Button>
    </div>
  </div>
);

export function FinishingOptions() {
  const { options, loading, error, fetchOptions, addOption, updateOption, deleteOption } =
    useFinishingOptionsStore();
  const [editingOption, setEditingOption] = useState<FinishingOption | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newOption, setNewOption] = useState({
    category: '',
    sub_category: '',
    setup_fee: 0,
    cost: 0,
    price: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Set initial category selection
  useEffect(() => {
    if (options.length > 0 && !selectedCategory) {
      setSelectedCategory(options[0].category);
    }
  }, [options, selectedCategory]); // Added selectedCategory to dependency array

  const uniqueCategories = Array.from(new Set(options.map((option) => option.category)));

  const filteredOptions = options.filter(
    (option) => !selectedCategory || option.category === selectedCategory
  );

  const handleAdd = async () => {
    await addOption(newOption);
    if (!error) {
      toast({
        title: 'Success',
        description: 'Finishing option added successfully',
      });
    }
  };

  const handleUpdate = async () => {
    if (editingOption) {
      await updateOption(editingOption.id, editingOption);
      if (!error) {
        setEditingOption(null);
        toast({
          title: 'Success',
          description: 'Finishing option updated successfully',
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    await deleteOption(id);
    if (!error) {
      toast({
        title: 'Success',
        description: 'Finishing option deleted successfully',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Finishing Options</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Finishing Option</DialogTitle>
              </DialogHeader>
              <OptionForm 
                option={newOption} 
                onSubmit={handleAdd} 
                isNew={true} 
                loading={loading}
                setOption={setNewOption}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex gap-4 mt-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Category" />
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Sub Category</TableHead>
              <TableHead>Setup Fee</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOptions.map((option) => (
              <TableRow key={option.id}>
                <TableCell>{option.category}</TableCell>
                <TableCell>{option.sub_category}</TableCell>
                <TableCell>R{option.setup_fee.toFixed(2)}</TableCell>
                <TableCell>R{option.cost.toFixed(2)}</TableCell>
                <TableCell>R{option.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Finishing Option</DialogTitle>
                        </DialogHeader>
                        <OptionForm
                          option={editingOption || option}
                          onSubmit={handleUpdate}
                          isNew={false}
                          loading={loading}
                          setOption={setEditingOption}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(option.id)}
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
