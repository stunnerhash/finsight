import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import type { SimpleBudgetCategory, TransactionFormData } from './types';

interface TransactionFormProps {
  formData: TransactionFormData;
  budgetCategories: readonly SimpleBudgetCategory[];
  onFormDataChange: (field: keyof TransactionFormData, value: string | 'income' | 'expense') => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  formData,
  budgetCategories,
  onFormDataChange,
  onSubmit,
  onClose,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Input
          value={formData.title}
          onChange={(e) => onFormDataChange('title', e.target.value)}
          placeholder="Transaction description"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Amount</label>
        <Input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => onFormDataChange('amount', e.target.value)}
          placeholder="0.00"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={formData.categoryId}
          onChange={(e) => onFormDataChange('categoryId', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
          required
        >
          <option value="">Select a category</option>
          {budgetCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Type</label>
        <select
          value={formData.type}
          onChange={(e) => onFormDataChange('type', e.target.value as 'income' | 'expense')}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      
      <DialogFooter className="flex gap-3 pt-4 p-0">
        <Button type="submit" className="flex-1">
          Add Transaction
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
      </DialogFooter>
    </form>
  );
};
