import { useState } from 'react';
import { financeService } from '@/services/financeService';

interface TransactionFormData {
  title: string;
  amount: string;
  categoryId: string;
  type: 'income' | 'expense';
}

export const useTransactionModals = (refreshData: () => void) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    title: '',
    amount: '',
    categoryId: '',
    type: 'expense'
  });

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
      
      // Refresh data
      refreshData();
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
      refreshData();
    } catch (err) {
      alert('Failed to add transaction: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleFormDataChange = (field: keyof TransactionFormData, value: string | 'income' | 'expense') => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ title: '', amount: '', categoryId: '', type: 'expense' });
  };

  return {
    // Modal states
    showAddModal,
    showReceiptModal,
    
    // Form data
    formData,
    
    // Actions
    setShowAddModal,
    setShowReceiptModal,
    handleAddTransaction,
    handleReceiptTransaction,
    handleFormDataChange,
    resetForm,
  };
};
