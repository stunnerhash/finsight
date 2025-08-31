import React, { useState, useEffect } from 'react';
import { Loading } from '@/components/ui/loading';
import { financeService } from '@/services/financeService';
import type { BackendBudgetCategory, PaginationInfo } from '@/services/api';
import type { BackendTransaction } from '@/services/api';
import {
  TransactionHeader,
  TransactionFilters,
  TransactionsTable,
  AddTransactionModal,
  ReceiptUploadModal
} from '@/components/transactions';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const TransactionsPage: React.FC = () => {
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    categoryId: '',
    type: 'expense' as 'income' | 'expense'
  });

  // Fetch all data (transactions + categories) - used for initial load
  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters for server-side filtering and pagination
      const queryParams: {
        page: number;
        limit: number;
        type?: 'income' | 'expense';
        search?: string;
        startDate?: string;
        endDate?: string;
      } = {
        page,
        limit: 10  // Changed from 20 to 10 transactions per page
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
      
      console.log('Transactions Response:', transactionsResponse);
      console.log('Pagination Info:', transactionsResponse.pagination);
      
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
      
      // Build query parameters for server-side filtering and pagination
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
    fetchTransactionsOnly(page); // Only fetch transactions, not entire page
  };

  // Handle search change - only filter locally, no API call
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    // No API call needed - search is handled locally
  };

  // Handle type filter change
  const handleTypeChange = (type: 'all' | 'income' | 'expense') => {
    setSelectedType(type);
    setCurrentPage(1); // Reset to first page when filtering
    fetchTransactionsOnly(1); // Only fetch transactions, not categories
  };

  // Handle category filter change
  const handleCategoryChange = (category: number | 'all') => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
    fetchTransactionsOnly(1); // Only fetch transactions, not categories
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  // Initial data fetch
  useEffect(() => {
    fetchData(1);
  }, []);



  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (formData.type === 'expense' && !formData.categoryId) {
      alert('Please select a category for expenses');
      return;
    }

    try {
      const transactionData: {
        title: string;
        amount: number;
        type: 'income' | 'expense';
        categoryId?: number;
      } = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        type: formData.type
      };
      
      if (formData.type === 'expense' && formData.categoryId) {
        transactionData.categoryId = parseInt(formData.categoryId);
      }
     
      await financeService.addTransaction(transactionData);

      setFormData({ title: '', amount: '', categoryId: '', type: 'expense' });
      setShowAddModal(false);
      
      // Refresh current page
      fetchData(currentPage);
    } catch (err) {
      alert('Failed to add transaction: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleReceiptTransaction = async (transactionData: {
    title: string;
    amount: number;
    categoryId: number;
    type: 'income' | 'expense';
  }) => {
    try {
      await financeService.addTransaction(transactionData);
      
      // Refresh current page
      fetchData(currentPage);
    } catch (err) {
      alert('Failed to add transaction: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Client-side filtering for search and category
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm.trim() === '' || 
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (transaction.categoryId && transaction.categoryId === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Client-side sorting (since backend doesn't support it yet)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
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

  const toggleSort = (field: 'date' | 'amount' | 'title') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading size="lg" text="Loading transactions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Failed to load transactions</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => fetchData(currentPage)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <TransactionHeader 
          onAddTransaction={() => setShowAddModal(true)} 
          onUploadReceipt={() => setShowReceiptModal(true)}
        />
        
        <TransactionFilters
          searchTerm={searchTerm}
          selectedType={selectedType}
          selectedCategory={selectedCategory}
          budgetCategories={budgetCategories}
          onSearchChange={handleSearchChange}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
          onClearFilters={handleClearFilters}
        />

        <TransactionsTable
          transactions={sortedTransactions}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={toggleSort}
          loading={transactionsLoading}
        />

        {/* Always show pagination for testing */}
        <div className="mt-6">
          {paginationInfo ? (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                    className={paginationInfo.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    size="default"
                  />
                </PaginationItem>
                
                {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === paginationInfo.currentPage}
                      className="cursor-pointer"
                      size="default"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                    className={paginationInfo.currentPage === paginationInfo.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    size="default"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : (
            <div className="text-center text-white">
              <p>Loading pagination...</p>
            </div>
          )}
        </div>

        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTransaction}
          formData={formData}
          onFormDataChange={(field, value) => setFormData({ ...formData, [field]: value })}
          budgetCategories={budgetCategories}
        />

        <ReceiptUploadModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          onSubmit={handleReceiptTransaction}
          budgetCategories={budgetCategories}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
