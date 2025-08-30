import React from 'react';
import { Filter, Plus} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DashboardHeaderProps } from '@/types/finance';

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  selectedPeriod, 
  onAddTransaction,
  // onPeriodChange 
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-left">Dashboard</h1>
      <p className="text-muted-foreground mt-1">
        Welcome back! Here's your financial overview for {selectedPeriod.toLowerCase()}.
      </p>
    </div>
    <div className="flex items-center gap-3">
      <Button variant="outline" className="gap-2 text-white hover:text-white">
        <Filter className="h-4 w-4" />
        {selectedPeriod}
      </Button>
      <Button className="gap-2" onClick={onAddTransaction}>
        <Plus className="h-4 w-4" />
        Add Transaction
      </Button>
    </div>
  </div>
);

export default DashboardHeader;
