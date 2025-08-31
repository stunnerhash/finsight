import React, { useState } from 'react';
import { 
  DashboardHeader,
  StatsSection,
  BudgetCategoriesSection,
  RecentTransactionsSection
} from '@/components/dashboard';
import { AddTransactionModal, ReceiptUploadModal } from '@/components/transactions';
import { Loading } from '@/components/ui/loading';
import { useDashboard } from '@/hooks/useDashboard';
import { financeService } from '@/services/financeService';
import type { BackendBudgetCategory } from '@/services/api';

const Dashboard: React.FC = () => {
  const {
    selectedPeriod,
    statsConfig,
    financeData,
    loading,
    error,
    handlePeriodChange,
    refreshData
  } = useDashboard();

  // Modal state for adding transaction
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    categoryId: '',
    type: 'expense' as 'income' | 'expense'
  });

  const handleAddTransactionClick = () => {
    setShowAddModal(true);
  };

  const handleUploadReceiptClick = () => {
    setShowReceiptModal(true);
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Only require category for expenses
    if (formData.type === 'expense' && !formData.categoryId) {
      alert('Please select a category for expenses');
      return;
    }

    try {
      await financeService.addTransaction({
        title: formData.title,
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId),
        type: formData.type
      });

      // Reset form and close modal
      setFormData({ title: '', amount: '', categoryId: '', type: 'expense' });
      setShowAddModal(false);
      
      // Refresh dashboard data
      refreshData();
    } catch (err) {
      alert('Failed to add transaction: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleReceiptTransaction = async (transactionData: {
    title: string;
    amount: number;
    categoryId: number;
    type: 'income' | 'expense';
  }) => {
    try {
      await financeService.addTransaction(transactionData);
      
      // Refresh dashboard data
      refreshData();
    } catch (err) {
      alert('Failed to add transaction: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!financeData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <DashboardHeader 
          selectedPeriod={selectedPeriod}
          onAddTransaction={handleAddTransactionClick}
          onUploadReceipt={handleUploadReceiptClick}
          onPeriodChange={handlePeriodChange}
        />
        
        <StatsSection statsConfig={statsConfig} />
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <BudgetCategoriesSection budgetCategories={financeData.budgetCategories as BackendBudgetCategory[]} />
          </div>
          
          <div>
            <RecentTransactionsSection recentTransactions={financeData.recentTransactions} />
          </div>
        </div>

        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTransaction}
          formData={formData}
          onFormDataChange={(field, value) => setFormData({ ...formData, [field]: value })}
          budgetCategories={financeData.budgetCategories}
        />

        <ReceiptUploadModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          onSubmit={handleReceiptTransaction}
          budgetCategories={financeData.budgetCategories}
        />
      </div>
    </div>
  );
};

export default Dashboard;
