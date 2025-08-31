export interface Transaction {
  readonly id: number;
  readonly description: string;
  readonly amount: number;
  readonly category: TransactionCategory;
  readonly date: string;
  readonly type: TransactionType;
}

export interface BudgetCategory {
  readonly id: number;
  readonly name: string;
  readonly budgeted: number;
  readonly spent: number;
  readonly color: string;
}

export interface FinanceData {
  readonly currentBudget: number;
  readonly totalExpenses: number;
  readonly monthlyIncome: number;
  readonly savingsGoal: number;
  readonly currentSavings: number;
  readonly recentTransactions: readonly Transaction[];
  readonly budgetCategories: readonly BudgetCategory[];
  // Month-over-month comparison data
  readonly previousMonthIncome: number;
  readonly previousMonthExpenses: number;
  readonly monthlyIncomeChange: number;
  readonly monthlyExpensesChange: number;
}

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'Food' 
  | 'Transportation' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Utilities' 
  | 'Healthcare' 
  | 'Salary'
  | 'Investment'
  | 'Other';

export type TimePeriod = 'Current Month' | 'Previous Month' | 'This Year';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
    description: string;
  };
  progress?: {
    value: number;
    description: string;
  };
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export interface BudgetCategoryItemProps {
  category: BudgetCategory;
  index: number;
}

export interface TransactionItemProps {
  transaction: Transaction;
}

export interface DashboardHeaderProps {
  selectedPeriod: TimePeriod;
  onAddTransaction: () => void;
  onPeriodChange: (period: TimePeriod) => void;
}
