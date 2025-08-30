import { useState, useMemo, useCallback, useEffect } from 'react';
import { financeService } from '@/services/financeService';
import { formatCurrency } from '@/utils/financeUtils';
import type { TimePeriod, StatCardProps, FinanceData } from '@/types/finance';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';

export const useDashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('This Month');
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await financeService.getFinanceData();
        setFinanceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching finance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculations = useMemo(() => {
    if (!financeData) return { budgetLeft: 0, budgetUsagePercent: 0, savingsProgress: 0 };
    
    const budgetLeft = financeData.currentBudget - financeData.totalExpenses;
    const budgetUsagePercent = (financeData.totalExpenses / financeData.currentBudget) * 100;
    const savingsProgress = (financeData.currentSavings / financeData.savingsGoal) * 100;
    
    return {
      budgetLeft,
      budgetUsagePercent,
      savingsProgress
    };
  }, [financeData]);
  
  const handleToggleBalance = useCallback(() => {
    setBalanceVisible(prev => !prev);
  }, []);
  
  const handleAddTransaction = useCallback(() => {
    // This will be handled by the component using this hook
    console.log('Add transaction clicked - navigation handled by component');
  }, []);
  
  const handlePeriodChange = useCallback((period: TimePeriod) => {
    setSelectedPeriod(period);
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.refreshData();
      setFinanceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, []);

  const statsConfig = useMemo((): StatCardProps[] => {
    if (!financeData) return [];
    
    return [
      {
        title: "Budget Remaining",
        value: calculations.budgetLeft,
        icon: Target,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        progress: {
          value: 100 - calculations.budgetUsagePercent,
          description: `${formatCurrency(financeData.totalExpenses)} of ${formatCurrency(financeData.currentBudget)} used`
        },
        isVisible: balanceVisible,
        onToggleVisibility: handleToggleBalance
      },
      {
        title: "Total Expenses",
        value: financeData.totalExpenses,
        icon: TrendingDown,
        iconBgColor: "bg-red-100",
        iconColor: "text-red-600",
        trend: {
          value: "12.5%",
          isPositive: false,
          description: "from last month"
        }
      },
      {
        title: "Monthly Income",
        value: financeData.monthlyIncome,
        icon: TrendingUp,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600",
        trend: {
          value: "2.1%",
          isPositive: true,
          description: "from last month"
        }
      },
      {
        title: "Savings Goal",
        value: financeData.currentSavings,
        icon: DollarSign,
        iconBgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        progress: {
          value: calculations.savingsProgress,
          description: `${formatCurrency(financeData.savingsGoal - financeData.currentSavings)} to reach goal`
        }
      }
    ];
  }, [financeData, calculations, balanceVisible, handleToggleBalance]);

  return {
    balanceVisible,
    selectedPeriod,
    calculations,
    statsConfig,
    financeData,
    loading,
    error,
    handleToggleBalance,
    handleAddTransaction,
    handlePeriodChange,
    refreshData
  };
};
