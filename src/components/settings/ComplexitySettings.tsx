import { useEffect, useState } from 'react';
import { useComplexityStore } from '@/store/complexityStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function ComplexitySettings() {
  const { complexities, loading, error, fetchComplexities, addComplexity, updateComplexity, deleteComplexity } =
    useComplexityStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [newComplexity, setNewComplexity] = useState({
    breakpoint: '',
    percent: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchComplexities();
  }, [fetchComplexities]);

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
    if (!newComplexity.breakpoint || !newComplexity.percent) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    await addComplexity({
      breakpoint: Number(newComplexity.breakpoint),
      percent: Number(newComplexity.percent),
    });
    
    if (!error) {
      setNewComplexity({ breakpoint: '', percent: '' });
      toast({
        title: 'Success',
        description: 'Complexity rule added successfully',
      });
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    await updateComplexity(id, data);
    if (!error) {
      setEditId(null);
      toast({
        title: 'Success',
        description: 'Complexity rule updated successfully',
      });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteComplexity(id);
    if (!error) {
      toast({
        title: 'Success',
        description: 'Complexity rule deleted successfully',
      });
    }
  };

  if (loading && complexities.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complexity Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Breakpoint"
              value={newComplexity.breakpoint}
              onChange={(e) =>
                setNewComplexity({
                  ...newComplexity,
                  breakpoint: e.target.value,
                })
              }
              type="number"
              min="0"
            />
            <Input
              placeholder="Percent"
              value={newComplexity.percent}
              onChange={(e) =>
                setNewComplexity({ ...newComplexity, percent: e.target.value })
              }
              type="number"
              min="0"
              max="100"
            />
            <Button onClick={handleAdd} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Breakpoint</TableHead>
                <TableHead>Percent</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complexities.map((complexity) => (
                <TableRow key={complexity.id}>
                  <TableCell>
                    {editId === complexity.id ? (
                      <Input
                        defaultValue={complexity.breakpoint}
                        onBlur={(e) =>
                          handleUpdate(complexity.id, {
                            breakpoint: Number(e.target.value),
                          })
                        }
                        type="number"
                        min="0"
                      />
                    ) : (
                      complexity.breakpoint
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === complexity.id ? (
                      <Input
                        defaultValue={complexity.percent}
                        onBlur={(e) =>
                          handleUpdate(complexity.id, {
                            percent: Number(e.target.value),
                          })
                        }
                        type="number"
                        min="0"
                        max="100"
                      />
                    ) : (
                      `${complexity.percent}%`
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setEditId(
                            editId === complexity.id ? null : complexity.id
                          )
                        }
                        disabled={loading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(complexity.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}