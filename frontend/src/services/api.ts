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
  categoryId?: number | null;
  category?: {
    id: number;
    name: string;
    budgeted: number;
    spent: number;
    color: string;
  } | null;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface PaginatedTransactionsResponse {
  transactions: BackendTransaction[];
  pagination: PaginationInfo;
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
  current: {
    income: number;
    expenses: number;
    savings: number;
  };
  previous: {
    income: number;
    expenses: number;
    savings: number;
  };
  changes: {
    income: number;
    expenses: number;
    savings: number;
  };
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
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
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getBudgetCategories(period?: string): Promise<BackendBudgetCategory[]> {
    const params = period ? `?period=${period}` : '';
    return this.request<BackendBudgetCategory[]>(`/budget/categories${params}`);
  }

  async getStats(period?: string): Promise<BackendStats> {
    const params = period ? `?period=${period}` : '';
    return this.request<BackendStats>(`/budget/stats${params}`);
  }

  async getTransactions(params?: {
    period?: string;
    page?: number;
    limit?: number;
    type?: 'income' | 'expense';
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedTransactionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.period) queryParams.append('period', params.period);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const url = `/transactions${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedTransactionsResponse>(url);
  }

  async addTransaction(transaction: {
    title: string;
    amount: number;
    categoryId?: number;
    type: 'income' | 'expense';
  }): Promise<BackendTransaction> {
    return this.request<BackendTransaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateBudgetCategory(categoryId: number, updates: {
    budgeted?: number;
    name?: string;
    color?: string;
  }): Promise<BackendBudgetCategory> {
    return this.request<BackendBudgetCategory>(`/budget/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
}

export const apiService = new ApiService();
