export interface BackendTransaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
    budgeted: number;
    spent: number;
    color: string;
  };
}

export interface BackendBudgetCategory {
  id: number;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}
