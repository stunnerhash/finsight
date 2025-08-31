import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Edit2 } from 'lucide-react';
import type { BudgetCategoryItemProps } from '@/types/finance';
import { formatCurrency, getBadgeVariant } from '@/utils/financeUtils';

const BudgetCategoryItem: React.FC<BudgetCategoryItemProps> = ({ category, onEdit }) => {
  const percentageUsed = useMemo(() => (category.spent / category.budgeted) * 100, [category.spent, category.budgeted]);
  const remaining = useMemo(() => category.budgeted - category.spent, [category.budgeted, category.spent]);
  
  return (
    <div 
      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-3 h-3 rounded-full ${category.color}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">{category.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formatCurrency(category.spent)} / {formatCurrency(category.budgeted)}
              </span>
              <Badge variant={getBadgeVariant(percentageUsed)}>
                {percentageUsed.toFixed(0)}%
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={Math.min(percentageUsed, 100)} className="flex-1 h-2" />
            <span className="text-xs text-muted-foreground min-w-fit">
              {formatCurrency(remaining)} left
            </span>
          </div>
        </div>
      </div>
      {onEdit && (
        <div
          onClick={() => onEdit(category)}
          className="ml-2 cursor-pointer text-blue-500 hover:text-blue-600 transition-colors"
        >
          <Edit2 className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default BudgetCategoryItem;
