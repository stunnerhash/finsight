import { useState, useEffect, useMemo } from 'react';
import { financeService } from '@/services/financeService';
import type { BackendTransaction, BackendBudgetCategory, PaginationInfo } from '@/services/api';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<BackendTransaction[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BackendBudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);

  // Fetch all data (transactions + categories) - used for initial load
  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: {
        page: number;
        limit: number;
        type?: 'income' | 'expense';
        search?: string;
        startDate?: string;
        endDate?: string;
      } = {
        page,
        limit: 10
      };
      
      if (selectedType !== 'all') {
        queryParams.type = selectedType;
      }
      
      if (searchTerm.trim()) {
        queryParams.search = searchTerm.trim();
      }
      
      const [transactionsResponse, categoriesData] = await Promise.all([
        financeService.apiService.getTransactions(queryParams),
        financeService.apiService.getBudgetCategories()
      ]);
      
      setTransactions(transactionsResponse.transactions);
      setPaginationInfo(transactionsResponse.pagination);
      setBudgetCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch only transactions - used for filter changes
  const fetchTransactionsOnly = async (page: number = 1) => {
    try {
      setTransactionsLoading(true);
      
      const queryParams: {
        page: number;
        limit: number;
        type?: 'income' | 'expense';
        search?: string;
        startDate?: string;
        endDate?: string;
      } = {
        page,
        limit: 10
      };
      
      if (selectedType !== 'all') {
        // Temporary fix: Invert the type to work around backend bug
        // When backend is fixed, remove this inversion
        const invertedType = selectedType === 'income' ? 'expense' : 'income';
        console.log('Original type:', selectedType, 'Inverted to:', invertedType);
        queryParams.type = invertedType;
      }
      
      if (searchTerm.trim()) {
        queryParams.search = searchTerm.trim();
      }
      
      const transactionsResponse = await financeService.apiService.getTransactions(queryParams);
      
      setTransactions(transactionsResponse.transactions);
      setPaginationInfo(transactionsResponse.pagination);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTransactionsOnly(page);
  };

  // Handle search change - only filter locally, no API call
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle type filter change
  const handleTypeChange = (type: 'all' | 'income' | 'expense') => {
    console.log('Filter type changed to:', type);
    setSelectedType(type);
    setCurrentPage(1);
    fetchTransactionsOnly(1);
  };

  // Handle category filter change
  const handleCategoryChange = (category: number | 'all') => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchTransactionsOnly(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  // Client-side filtering for search and category
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = searchTerm.trim() === '' || 
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
        (transaction.categoryId && transaction.categoryId === selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, selectedCategory]);

  // Client-side sorting
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredTransactions, sortBy, sortOrder]);

  const toggleSort = (field: 'date' | 'amount' | 'title') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData(1);
  }, []);

  return {
    // State
    transactions,
    budgetCategories,
    loading,
    transactionsLoading,
    error,
    searchTerm,
    selectedType,
    selectedCategory,
    sortBy,
    sortOrder,
    currentPage,
    paginationInfo,
    filteredTransactions,
    sortedTransactions,
    
    // Actions
    fetchData,
    fetchTransactionsOnly,
    handlePageChange,
    handleSearchChange,
    handleTypeChange,
    handleCategoryChange,
    handleClearFilters,
    toggleSort,
    setCurrentPage,
  };
};
