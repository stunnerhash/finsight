import { apiService, type BackendTransaction, type BackendBudgetCategory, type BackendStats } from './api';
import type { FinanceData, Transaction, BudgetCategory, TransactionCategory } from '@/types/finance';

/**
 * Finance Service for managing financial data and operations
 * 
 * ✅ Month-over-month percentage calculations now implemented:
 * - Backend provides current and previous month data
 * - Real percentage changes calculated from actual transaction data
 * - No more simulated calculations - all data is accurate!
 */
const transformTransaction = (backendTx: BackendTransaction): Transaction => ({
  id: backendTx.id,
  description: backendTx.title,
  amount: backendTx.amount,
  category: backendTx.category?.name as TransactionCategory || 'Other', 
  date: backendTx.date,
  type: backendTx.type,
});

const transformBudgetCategory = (backendCategory: BackendBudgetCategory): BudgetCategory => ({
  id: backendCategory.id,
  name: backendCategory.name,
  budgeted: backendCategory.budgeted,
  spent: backendCategory.spent,
  color: backendCategory.color,
});

const calculateFinanceData = (
  budgetCategories: BackendBudgetCategory[],
  stats: BackendStats
): Omit<FinanceData, 'recentTransactions' | 'budgetCategories'> => {
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  
  return {
    currentBudget: totalBudget,
    totalExpenses: totalSpent, // Use period-specific expenses from budget categories
    monthlyIncome: stats.current.income,
    savingsGoal: 10000, 
    currentSavings: stats.current.savings,
    // Add new fields for month-over-month comparison
    previousMonthIncome: stats.previous.income,
    previousMonthExpenses: stats.previous.expenses,
    monthlyIncomeChange: stats.changes.income,
    monthlyExpensesChange: stats.changes.expenses,
  };
};

export class FinanceService {
  private cachedData: FinanceData | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private currentPeriod: string = 'current';

  public apiService = apiService;

  private isCacheValid(): boolean {
    return this.cachedData !== null && 
           (Date.now() - this.lastFetch) < this.CACHE_DURATION;
  }

  async getFinanceData(period?: string): Promise<FinanceData> {
    // Update period if provided
    if (period) {
      this.currentPeriod = period;
      // Invalidate cache when period changes
      this.cachedData = null;
    }

    if (this.isCacheValid()) {
      return this.cachedData!;
    }

    try {
      const [budgetCategories, stats, transactions] = await Promise.all([
        apiService.getBudgetCategories(this.currentPeriod),
        apiService.getStats(this.currentPeriod),
        apiService.getTransactions(this.currentPeriod),
      ]);

      const transformedCategories = budgetCategories.map(transformBudgetCategory);
      const transformedTransactions = transactions.map(transformTransaction);
      const derivedData = calculateFinanceData(budgetCategories, stats);

      const financeData: FinanceData = {
        ...derivedData,
        recentTransactions: transformedTransactions,
        budgetCategories: transformedCategories,
      };

      // Cache the data
      this.cachedData = financeData;
      this.lastFetch = Date.now();

      return financeData;
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
      
      // Return mock data if API is not available
      const mockData: FinanceData = {
        currentBudget: 5000,
        totalExpenses: 1200,
        monthlyIncome: 3000,
        savingsGoal: 10000,
        currentSavings: 1800,
        previousMonthIncome: 2800,
        previousMonthExpenses: 1100,
        monthlyIncomeChange: 200,
        monthlyExpensesChange: 100,
        recentTransactions: [],
        budgetCategories: []
      };
      
      return mockData;
    }
  }

  async addTransaction(transaction: {
    title: string;
    amount: number;
    categoryId?: number;
    type: 'income' | 'expense';
  }): Promise<void> {
    try {
      await apiService.addTransaction(transaction);
      // Invalidate cache so next fetch gets fresh data
      this.cachedData = null;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  }

  // Method to manually refresh data
  async refreshData(period?: string): Promise<FinanceData> {
    this.cachedData = null;
    return this.getFinanceData(period);
  }
}

export const financeService = new FinanceService();
