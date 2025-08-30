import React from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface TransactionHeaderProps {
  onAddTransaction: () => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({ onAddTransaction }) => {
  return (
    <>
      {/* Navigation Breadcrumb */}
      <div className="mb-6 text-left">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 text-left">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        <Button onClick={onAddTransaction} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>
    </>
  );
};

export default TransactionHeader;
