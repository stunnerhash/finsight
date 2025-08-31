import { useState } from 'react';
import type { TransactionFormData } from '../types';

interface UseTransactionFormProps {
  onSubmit: (transactionData: {
    title: string;
    amount: number;
    categoryId: number;
    type: 'income' | 'expense';
  }) => void;
  onClose: () => void;
  initialTitle?: string;
}

export const useTransactionForm = ({ onSubmit, onClose, initialTitle = '' }: UseTransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    title: initialTitle,
    amount: '',
    categoryId: '',
    type: 'expense',
  });

  const updateFormField = (field: keyof TransactionFormData, value: string | 'income' | 'expense') => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const setAmount = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.categoryId) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit({
      title: formData.title,
      amount: parseFloat(formData.amount),
      categoryId: parseInt(formData.categoryId),
      type: formData.type,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      categoryId: '',
      type: 'expense',
    });
  };

  return {
    formData,
    updateFormField,
    setAmount,
    handleSubmit,
    resetForm,
  };
};
