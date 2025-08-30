import type { FinanceData } from '@/types/finance';

export const mockFinanceData: FinanceData = {
  currentBudget: 2500,
  totalExpenses: 1847.32,
  monthlyIncome: 5000,
  savingsGoal: 1000,
  currentSavings: 652.68,
  recentTransactions: [
    { id: 1, description: "Grocery Store", amount: -1250.50, category: "Food" as const, date: "2024-08-29", type: "expense" as const },
    { id: 2, description: "Salary Deposit", amount: 50000.00, category: "Salary" as const, date: "2024-08-28", type: "income" as const },
    { id: 3, description: "Netflix", amount: -1500.99, category: "Entertainment" as const, date: "2024-08-27", type: "expense" as const },
    { id: 4, description: "Petrol", amount: -750.20, category: "Transportation" as const, date: "2024-08-26", type: "expense" as const },
    { id: 5, description: "Restaurant", amount: -890.45, category: "Food" as const, date: "2024-08-25", type: "expense" as const }
  ],
  budgetCategories: [
    { name: "Food", budgeted: 8000, spent: 4560.78, color: "bg-blue-500" },
    { name: "Transportation", budgeted: 4000, spent: 2670.34, color: "bg-green-500" },
    { name: "Entertainment", budgeted: 3000, spent: 1450.99, color: "bg-purple-500" },
    { name: "Shopping", budgeted: 5000, spent: 2890.45, color: "bg-orange-500" },
    { name: "Utilities", budgeted: 3000, spent: 2450.67, color: "bg-red-500" },
    { name: "Healthcare", budgeted: 2000, spent: 890.23, color: "bg-pink-500" }
  ]
} as const;
