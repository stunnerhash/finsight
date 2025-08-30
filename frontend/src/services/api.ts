const API_BASE_URL = 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

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
  transactions: BackendTransaction[];
}

export interface BackendStats {
  income: number;
  expenses: number;
  savings: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: ApiResponse<T> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data as T;
  }

  async getBudgetCategories(): Promise<BackendBudgetCategory[]> {
    return this.request<BackendBudgetCategory[]>('/budget/categories');
  }

  async getStats(): Promise<BackendStats> {
    return this.request<BackendStats>('/budget/stats');
  }

  async getTransactions(): Promise<BackendTransaction[]> {
    return this.request<BackendTransaction[]>('/transactions');
  }

  async addTransaction(transaction: {
    title: string;
    amount: number;
    categoryId: number;
    type: 'income' | 'expense';
  }): Promise<BackendTransaction> {
    return this.request<BackendTransaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }
}

export const apiService = new ApiService();
