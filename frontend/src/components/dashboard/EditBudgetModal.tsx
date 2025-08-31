import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BackendBudgetCategory } from '@/services/api';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: BackendBudgetCategory | null;
  onSave: (categoryId: number, budgeted: number) => Promise<void>;
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave
}) => {
  const [budgeted, setBudgeted] = useState<string>('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (category) {
      setBudgeted(category.budgeted.toString());
    }
  }, [category]);

  const handleSave = async () => {
    if (!category || !budgeted) return;
    
    const budgetedAmount = parseFloat(budgeted);
    if (isNaN(budgetedAmount) || budgetedAmount < 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    try {
      setLoading(true);
      await onSave(category.id, budgetedAmount);
      onClose();
    } catch (error) {
      alert('Failed to update budget: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Budget - {category?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budgeted">Budget Amount</Label>
            <Input
              id="budgeted"
              type="number"
              value={budgeted}
              onChange={(e) => setBudgeted(e.target.value)}
              placeholder="Enter budget amount"
              min="0"
              step="0.01"
            />
          </div>
          
          {category && (
            <div className="text-sm text-muted-foreground">
              <p>Current spent: ${category.spent.toLocaleString()}</p>
              <p>Current budget: ${category.budgeted.toLocaleString()}</p>
            </div>
          )}
          
          <div className="flex justify-end gap-2 text-background">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
