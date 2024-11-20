import { useEffect, useState } from 'react';
import { usePaperStore } from '@/store/paperStore';
import type { PaperCatalog } from '@/types/database.types';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface PaperFormData {
  type: string;
  name: string;
  grammage: string;
  micron: string | null;
  size: string;
  cost: number;
  markup_percentage: number;
  price: number;
  order_sequence: number;
  active: boolean;
}

interface PaperFormProps {
  paper: PaperFormData;
  onSubmit: () => Promise<void>;
  isNew?: boolean;
  loading: boolean;
  setPaper: (paper: PaperFormData) => void;
}

const PaperForm = ({ paper, onSubmit, isNew = false, loading, setPaper }: PaperFormProps) => (
  <div className="grid gap-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Input
          id="type"
          value={paper.type}
          onChange={(e) => setPaper({ ...paper, type: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={paper.name}
          onChange={(e) => setPaper({ ...paper, name: e.target.value })}
        />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="grammage">Grammage</Label>
        <Input
          id="grammage"
          type="text"
          value={paper.grammage}
          onChange={(e) => setPaper({ ...paper, grammage: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="micron">Micron</Label>
        <Input
          id="micron"
          value={paper.micron || ''}
          onChange={(e) => setPaper({ ...paper, micron: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Input
          id="size"
          value={paper.size}
          onChange={(e) => setPaper({ ...paper, size: e.target.value })}
        />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="cost">Cost</Label>
        <Input
          id="cost"
          type="number"
          step="0.01"
          value={paper.cost}
          onChange={(e) => setPaper({ ...paper, cost: Number(e.target.value) })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="markup">Markup %</Label>
        <Input
          id="markup"
          type="number"
          value={paper.markup_percentage}
          onChange={(e) => setPaper({ ...paper, markup_percentage: Number(e.target.value) })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={paper.price}
          onChange={(e) => setPaper({ ...paper, price: Number(e.target.value) })}
        />
      </div>
    </div>
    <div className="flex justify-end">
      <Button onClick={onSubmit} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {isNew ? 'Add Paper' : 'Update Paper'}
      </Button>
    </div>
  </div>
);

export function PaperList() {
  const { papers, loading, error, fetchPapers, addPaper, updatePaper, deletePaper } = usePaperStore();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedName, setSelectedName] = useState<string>('all');
  const [editingPaper, setEditingPaper] = useState<PaperCatalog | null>(null);
  const [editingFormData, setEditingFormData] = useState<PaperFormData>({
    type: '',
    name: '',
    grammage: '',
    micron: null,
    size: '',
    cost: 0,
    markup_percentage: 0,
    price: 0,
    order_sequence: 0,
    active: true,
  });
  const [newPaper, setNewPaper] = useState<PaperFormData>({
    type: '',
    name: '',
    grammage: '',
    micron: null,
    size: '',
    cost: 0,
    markup_percentage: 0,
    price: 0,
    order_sequence: 0,
    active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Update form data when editing paper changes
  useEffect(() => {
    if (editingPaper) {
      setEditingFormData({
        type: editingPaper.type,
        name: editingPaper.name,
        grammage: editingPaper.grammage,
        micron: editingPaper.micron,
        size: editingPaper.size,
        cost: editingPaper.cost,
        markup_percentage: editingPaper.markup_percentage,
        price: editingPaper.price,
        order_sequence: editingPaper.order_sequence,
        active: editingPaper.active,
      });
    }
  }, [editingPaper]);

  const uniqueTypes = Array.from(new Set(papers.map((paper) => paper.type)));
  const uniqueNames = Array.from(new Set(papers.map((paper) => paper.name)));

  const filteredPapers = papers.filter((paper) => {
    const matchesType = selectedType === 'all' || paper.type === selectedType;
    const matchesName = selectedName === 'all' || paper.name === selectedName;
    return matchesType && matchesName;
  });

  const handleAdd = async () => {
    await addPaper({
      ...newPaper,
      created_by: 'system',
      updated_by: 'system',
    });
    if (!error) {
      toast({
        title: 'Success',
        description: 'Paper added successfully',
      });
    }
  };

  const handleUpdate = async () => {
    if (editingPaper) {
      await updatePaper(editingPaper.id, {
        ...editingPaper,
        ...editingFormData,
        updated_by: 'system',
      });
      if (!error) {
        setEditingPaper(null);
        toast({
          title: 'Success',
          description: 'Paper updated successfully',
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    await deletePaper(id);
    if (!error) {
      toast({
        title: 'Success',
        description: 'Paper deleted successfully',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Paper Catalog</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Paper
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Paper</DialogTitle>
              </DialogHeader>
              <PaperForm 
                paper={newPaper} 
                onSubmit={handleAdd} 
                isNew={true}
                loading={loading}
                setPaper={setNewPaper}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex gap-4 mt-4">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedName} onValueChange={setSelectedName}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Names</SelectItem>
              {uniqueNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
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
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Grammage</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPapers.map((paper) => (
              <TableRow key={paper.id}>
                <TableCell>{paper.name}</TableCell>
                <TableCell>{paper.type}</TableCell>
                <TableCell>{paper.grammage}</TableCell>
                <TableCell>{paper.size}</TableCell>
                <TableCell>R{paper.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingPaper(paper)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Paper</DialogTitle>
                        </DialogHeader>
                        <PaperForm
                          paper={editingFormData}
                          onSubmit={handleUpdate}
                          isNew={false}
                          loading={loading}
                          setPaper={setEditingFormData}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(paper.id)}
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