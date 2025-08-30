import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DashboardHeader,
  StatsSection,
  BudgetCategoriesSection,
  RecentTransactionsSection
} from '@/components/dashboard';
import { Loading } from '@/components/ui/loading';
import { useDashboard } from '@/hooks/useDashboard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedPeriod,
    statsConfig,
    financeData,
    loading,
    error,
    handlePeriodChange,
    refreshData
  } = useDashboard();

  const handleAddTransactionClick = () => {
    navigate('/transactions');
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
          onPeriodChange={handlePeriodChange}
        />
        
        <StatsSection statsConfig={statsConfig} />
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <BudgetCategoriesSection budgetCategories={financeData.budgetCategories} />
          </div>
          
          <div>
            <RecentTransactionsSection recentTransactions={financeData.recentTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
