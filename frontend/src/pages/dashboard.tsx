import React from 'react';
import { 
  DashboardHeader,
  StatsSection,
  BudgetCategoriesSection,
  RecentTransactionsSection,
  AnalyticsSection
} from '@/components/dashboard';
import { AddTransactionModal, ReceiptUploadModal } from '@/components/transactions';
import { Loading } from '@/components/ui/loading';
import { useDashboard } from '@/hooks/useDashboard';
import { useDashboardModals } from '@/hooks/useDashboardModals';
import { useChartData } from '@/hooks/useChartData';
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

  const {
    transactions,
    budgetCategories,
    fetchChartData
  } = useChartData();

  const {
    showAddModal,
    showReceiptModal,
    formData,
    setShowAddModal,
    setShowReceiptModal,
    handleAddTransaction,
    handleReceiptTransaction,
    handleFormDataChange,
  } = useDashboardModals(refreshData, fetchChartData);

  const handleAddTransactionClick = () => {
    setShowAddModal(true);
  };

  const handleUploadReceiptClick = () => {
    setShowReceiptModal(true);
  };

  const handleBudgetUpdate = async (categoryId: number, budgeted: number) => {
    try {
      await financeService.apiService.updateBudgetCategory(categoryId, { budgeted });
      
      // Refresh dashboard data
      refreshData();
      // Refresh chart data
      fetchChartData();
    } catch (err) {
      alert('Failed to update budget: ' + (err instanceof Error ? err.message : 'Unknown error'));
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
            <BudgetCategoriesSection 
              budgetCategories={financeData.budgetCategories as BackendBudgetCategory[]} 
              onBudgetUpdate={handleBudgetUpdate}
            />
          </div>
          
          <div>
            <RecentTransactionsSection recentTransactions={financeData.recentTransactions} />
          </div>
        </div>

        <AnalyticsSection 
          transactions={transactions}
          budgetCategories={budgetCategories}
        />

        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTransaction}
          formData={formData}
          onFormDataChange={handleFormDataChange}
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
