import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BudgetCategoryItem  from '@/components/dashboard/BudgetCategoryItem';
import { EditBudgetModal } from '@/components/dashboard/EditBudgetModal';
import type { BudgetCategory } from '@/types/finance';
import type { BackendBudgetCategory } from '@/services/api';

interface BudgetCategoriesSectionProps {
  budgetCategories: BudgetCategory[];
  onBudgetUpdate?: (categoryId: number, budgeted: number) => Promise<void>;
}

const BudgetCategoriesSection: React.FC<BudgetCategoriesSectionProps> = ({ budgetCategories, onBudgetUpdate }) => {
  const [editingCategory, setEditingCategory] = useState<BackendBudgetCategory | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (category: BudgetCategory) => {
    // Convert BudgetCategory to BackendBudgetCategory for the modal
    const backendCategory: BackendBudgetCategory = {
      id: category.id,
      name: category.name,
      budgeted: category.budgeted,
      spent: category.spent,
      color: category.color,
      transactions: []
    };
    setEditingCategory(backendCategory);
    setShowEditModal(true);
  };

  const handleSave = async (categoryId: number, budgeted: number) => {
    if (onBudgetUpdate) {
      await onBudgetUpdate(categoryId, budgeted);
    }
  };

  // Sort budget categories by amount spent in descending order
  const sortedCategories = [...budgetCategories].sort((a, b) => b.spent - a.spent);

  return (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>Budget Categories</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {sortedCategories.map((category, index) => (
          <BudgetCategoryItem 
            key={`${category.name}-${index}`} 
            category={category} 
            index={index}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </CardContent>
    
    <EditBudgetModal
      isOpen={showEditModal}
      onClose={() => setShowEditModal(false)}
      category={editingCategory}
      onSave={handleSave}
    />
  </Card>
  );
};

export default BudgetCategoriesSection;
