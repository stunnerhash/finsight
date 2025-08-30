import { apiService, type BackendTransaction, type BackendBudgetCategory, type BackendStats } from './api';
import type { FinanceData, Transaction, BudgetCategory, TransactionCategory } from '@/types/finance';

const transformTransaction = (backendTx: BackendTransaction): Transaction => ({
  id: backendTx.id,
  description: backendTx.title,
  amount: backendTx.amount,
  category: backendTx.category.name as TransactionCategory, 
  date: backendTx.date,
  type: backendTx.type,
});

const transformBudgetCategory = (backendCategory: BackendBudgetCategory): BudgetCategory => ({
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
  const totalExpenses = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  
  return {
    currentBudget: totalBudget,
    totalExpenses,
    monthlyIncome: stats.income,
    savingsGoal: 10000, 
    currentSavings: stats.savings,
  };
};

export class FinanceService {
  private cachedData: FinanceData | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  public apiService = apiService;

  private isCacheValid(): boolean {
    return this.cachedData !== null && 
           (Date.now() - this.lastFetch) < this.CACHE_DURATION;
  }

  async getFinanceData(): Promise<FinanceData> {
    if (this.isCacheValid()) {
      return this.cachedData!;
    }

    try {
      const [budgetCategories, stats, transactions] = await Promise.all([
        apiService.getBudgetCategories(),
        apiService.getStats(),
        apiService.getTransactions(),
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
      throw error;
    }
  }

  async addTransaction(transaction: {
    title: string;
    amount: number;
    categoryId: number;
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
  async refreshData(): Promise<FinanceData> {
    this.cachedData = null;
    return this.getFinanceData();
  }
}

export const financeService = new FinanceService();
