import { useEffect, useState } from 'react';
import { useSetupFeesStore } from '@/store/setupFeesStore';
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
import { Pencil, Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const DEFAULT_QUANTITIES = [
  '10',
  '20',
  '30',
  '40',
  '50',
  '60',
  '70',
  '80',
  '90',
  '100',
  '125',
  '150',
  '175',
  '200',
  '250',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '1000',
  '1500',
  '2000',
];

type SetupFeesData = Record<string, number>;

export function SetupFees() {
  const { setupFees, loading, error, fetchSetupFees, updateSetupFees, createSetupFees, deleteSetupFees } = useSetupFeesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedFees, setEditedFees] = useState<SetupFeesData>({});
  const { toast } = useToast();
  const [newSetupFees, setNewSetupFees] = useState<SetupFeesData>(
    DEFAULT_QUANTITIES.reduce((acc, qty) => ({ ...acc, [qty]: 0 }), {})
  );

  useEffect(() => {
    fetchSetupFees();
  }, [fetchSetupFees]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (setupFees) {
      const fees: SetupFeesData = DEFAULT_QUANTITIES.reduce(
        (acc, qty) => ({
          ...acc,
          [qty]: typeof setupFees[qty] === 'number' ? setupFees[qty] : 0
        }),
        {}
      );
      setEditedFees(fees);
    }
  }, [setupFees]);

  const handleSave = async () => {
    if (setupFees) {
      await updateSetupFees(editedFees);
    } else {
      await createSetupFees(newSetupFees);
    }
    setIsEditing(false);
    toast({
      title: 'Success',
      description: 'Setup fees updated successfully',
    });
  };

  const handleDelete = async () => {
    if (setupFees) {
      await deleteSetupFees(setupFees.id);
      toast({
        title: 'Success',
        description: 'Setup fees deleted successfully',
      });
    }
  };

  if (loading && !setupFees) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderTable = (data: SetupFeesData, isNewForm = false) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Quantity</TableHead>
          <TableHead>Fee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {DEFAULT_QUANTITIES.map((qty) => (
          <TableRow key={qty}>
            <TableCell>{qty}</TableCell>
            <TableCell>
              {isEditing || isNewForm ? (
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={isNewForm ? newSetupFees[qty] : editedFees[qty]}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (isNewForm) {
                      setNewSetupFees((prev) => ({
                        ...prev,
                        [qty]: value,
                      }));
                    } else {
                      setEditedFees((prev) => ({
                        ...prev,
                        [qty]: value,
                      }));
                    }
                  }}
                  className="w-24"
                />
              ) : (
                `R${(data[qty] || 0).toFixed(2)}`
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Setup Fees</CardTitle>
        <div className="flex gap-2">
          {setupFees ? (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
                disabled={loading}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              {isEditing && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Setup Fees</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  {renderTable(newSetupFees, true)}
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => createSetupFees(newSetupFees)} disabled={loading}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {setupFees && renderTable(setupFees as unknown as SetupFeesData)}
      </CardContent>
    </Card>
  );
}