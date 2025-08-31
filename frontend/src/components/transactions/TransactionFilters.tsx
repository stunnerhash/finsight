import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BackendBudgetCategory {
  id: number;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

interface TransactionFiltersProps {
  searchTerm: string;
  selectedType: 'all' | 'income' | 'expense';
  selectedCategory: number | 'all';
  budgetCategories: BackendBudgetCategory[];
  onSearchChange: (value: string) => void;
  onTypeChange: (value: 'all' | 'income' | 'expense') => void;
  onCategoryChange: (value: number | 'all') => void;
  onClearFilters: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  selectedType,
  selectedCategory,
  budgetCategories,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onClearFilters
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as 'all' | 'income' | 'expense')}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">All Categories</option>
            {budgetCategories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={onClearFilters}
            className="text-white hover:text-white"
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionFilters;
