import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BudgetCategoryItem  from '@/components/dashboard/BudgetCategoryItem';
import type { BudgetCategory } from '@/types/finance';

interface BudgetCategoriesSectionProps {
  budgetCategories: readonly BudgetCategory[];
}

const BudgetCategoriesSection: React.FC<BudgetCategoriesSectionProps> = ({ budgetCategories }) => (
  <Card className="mb-8">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Budget Categories</CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4 text-white hover:text-white" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {budgetCategories.map((category, index) => (
          <BudgetCategoryItem 
            key={`${category.name}-${index}`} 
            category={category} 
            index={index} 
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default BudgetCategoriesSection;
