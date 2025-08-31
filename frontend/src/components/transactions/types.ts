// Simple interface for components that don't need the full API type
export interface SimpleBudgetCategory {
  id: number;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

export interface TransactionFormData {
  title: string;
  amount: string;
  categoryId: string;
  type: 'income' | 'expense';
}
