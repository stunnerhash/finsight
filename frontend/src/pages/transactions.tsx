import React, { useState, useEffect } from 'react';
import { Loading } from '@/components/ui/loading';
import { financeService } from '@/services/financeService';
import type { BackendTransaction, BackendBudgetCategory } from '@/services/api';
import {
  TransactionHeader,
  TransactionFilters,
  TransactionsTable,
  AddTransactionModal,
  ReceiptUploadModal
} from '@/components/transactions';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<BackendTransaction[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BackendBudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    categoryId: '',
    type: 'expense' as 'income' | 'expense'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transactionsData, categoriesData] = await Promise.all([
        financeService.apiService.getTransactions(),
        financeService.apiService.getBudgetCategories()
      ]);
      
      setTransactions(transactionsData);
      setBudgetCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

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
      
      fetchData();
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
      
      // Refresh data
      fetchData();
    } catch (err) {
      alert('Failed to add transaction: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || 
      (transaction.categoryId && transaction.categoryId === selectedCategory);
    
    return matchesSearch && matchesType && matchesCategory;
  });

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
            onClick={fetchData}
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
          onSearchChange={setSearchTerm}
          onTypeChange={setSelectedType}
          onCategoryChange={setSelectedCategory}
          onClearFilters={() => {
            setSearchTerm('');
            setSelectedType('all');
            setSelectedCategory('all');
          }}
        />

        <TransactionsTable
          transactions={sortedTransactions as BackendTransaction[]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={toggleSort}
        />

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
