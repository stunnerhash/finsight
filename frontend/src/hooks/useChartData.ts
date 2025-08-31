import { useState, useEffect } from 'react';
import { financeService } from '@/services/financeService';
import type { BackendBudgetCategory, BackendTransaction } from '@/services/api';

export const useChartData = () => {
  const [transactions, setTransactions] = useState<BackendTransaction[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BackendBudgetCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch chart data
  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transactionsResponse, categoriesData] = await Promise.all([
        financeService.apiService.getTransactions({ limit: 1000 }), // Get more transactions for charts
        financeService.apiService.getBudgetCategories()
      ]);
      
      setTransactions(transactionsResponse.transactions);
      setBudgetCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chart data';
      setError(errorMessage);
      console.error('Failed to fetch chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chart data on component mount
  useEffect(() => {
    fetchChartData();
  }, []);

  return {
    // State
    transactions,
    budgetCategories,
    loading,
    error,
    
    // Actions
    fetchChartData,
  };
};
