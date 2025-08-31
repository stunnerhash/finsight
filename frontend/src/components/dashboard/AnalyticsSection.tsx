import React from 'react';
import { ExpensesByCategoryChart } from '@/components/charts';
import type { BackendBudgetCategory, BackendTransaction } from '@/services/api';

interface AnalyticsSectionProps {
  transactions: BackendTransaction[];
  budgetCategories: BackendBudgetCategory[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  transactions,
  budgetCategories
}) => {
  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-left">Analytics</h2>
      <div className="w-full">
        <ExpensesByCategoryChart
          transactions={transactions}
          budgetCategories={budgetCategories}
        />
      </div>
    </div>
  );
};
