import { useState, useMemo, useCallback, useEffect } from 'react';
import { financeService } from '@/services/financeService';
import { formatCurrency } from '@/utils/financeUtils';
import type { TimePeriod, StatCardProps, FinanceData } from '@/types/finance';
import { TrendingUp, TrendingDown, Target, IndianRupee } from 'lucide-react';

/**
 * Dashboard hook for managing finance data and statistics
 * 
 * ✅ Month-over-month percentage calculations now use real data from the API:
 * - Fetches current month and previous month data from backend
 * - Calculates actual percentage changes based on real transaction data
 * - No more simulated baselines - all percentages are accurate!
 */
export const useDashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('Current Month');
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
  
  const handlePeriodChange = useCallback(async (period: TimePeriod) => {
    setSelectedPeriod(period);
    
    // Map frontend period to backend period
    let backendPeriod: string;
    switch (period) {
      case 'Current Month':
        backendPeriod = 'current';
        break;
      case 'Previous Month':
        backendPeriod = 'previous';
        break;
      case 'This Year':
        backendPeriod = 'yearly';
        break;
      default:
        backendPeriod = 'current';
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getFinanceData(backendPeriod);
      setFinanceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching finance data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Map current period to backend period
      let backendPeriod: string;
      switch (selectedPeriod) {
        case 'Current Month':
          backendPeriod = 'current';
          break;
        case 'Previous Month':
          backendPeriod = 'previous';
          break;
        case 'This Year':
          backendPeriod = 'yearly';
          break;
        default:
          backendPeriod = 'current';
      }
      
      const data = await financeService.getFinanceData(backendPeriod);
      setFinanceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  const statsConfig = useMemo((): StatCardProps[] => {
    if (!financeData) return [];
    
    // Use real month-over-month data from the API
    const monthlyIncomeChange = {
      value: Math.abs(financeData.monthlyIncomeChange).toFixed(1),
      isPositive: financeData.monthlyIncomeChange >= 0,
      description: "from last month"
    };
    
    const monthlyExpensesChange = {
      value: Math.abs(financeData.monthlyExpensesChange).toFixed(1),
      isPositive: financeData.monthlyExpensesChange >= 0,
      description: "from last month"
    };
    
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
          value: `${monthlyExpensesChange.value}%`,
          isPositive: monthlyExpensesChange.isPositive,
          description: monthlyExpensesChange.description
        }
      },
      {
        title: "Monthly Income",
        value: financeData.monthlyIncome,
        icon: TrendingUp,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600",
        trend: {
          value: `${monthlyIncomeChange.value}%`,
          isPositive: monthlyIncomeChange.isPositive,
          description: monthlyIncomeChange.description
        }
      },
      {
        title: "Savings Goal",
        value: financeData.currentSavings,
        icon: IndianRupee,
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
