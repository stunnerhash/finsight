import React from 'react';
import { Plus, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PeriodSelector } from '@/components/dashboard';
import type { DashboardHeaderProps } from '@/types/finance';

interface ExtendedDashboardHeaderProps extends DashboardHeaderProps {
  onUploadReceipt: () => void;
}

const DashboardHeader: React.FC<ExtendedDashboardHeaderProps> = ({ 
  selectedPeriod, 
  onAddTransaction,
  onUploadReceipt,
  onPeriodChange 
}) => (
  <div className="flex flex-col md:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="font-bold tracking-tight sm:text-sm lg:text-left text-center">Dashboard</h1>
      <p className="text-muted-foreground mt-1 lg:text-left text-center">
        Welcome back! Here's your financial overview for {selectedPeriod.toLowerCase()}.
      </p>
    </div>
    <div className="flex items-center gap-3">
      <PeriodSelector 
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange}
      />
      <Button variant="outline" className="gap-2 text-white hover:text-white" onClick={onUploadReceipt}>
        <Camera className="h-4 w-4 " />
        Upload Receipt
      </Button>
      <Button className="gap-2" onClick={onAddTransaction}>
        <Plus className="h-4 w-4" />
        Add Transaction
      </Button>
    </div>
  </div>
);

export default DashboardHeader;
