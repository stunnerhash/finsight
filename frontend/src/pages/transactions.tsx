import React from 'react';
import { Loading } from '@/components/ui/loading';
import { useTransactions } from '@/hooks/useTransactions';
import { useTransactionModals } from '@/hooks/useTransactionModals';
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
  const {
    // State
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
    sortedTransactions,
    
    // Actions
    fetchData,
    handlePageChange,
    handleSearchChange,
    handleTypeChange,
    handleCategoryChange,
    handleClearFilters,
    toggleSort,
  } = useTransactions();

  const {
    showAddModal,
    showReceiptModal,
    formData,
    setShowAddModal,
    setShowReceiptModal,
    handleAddTransaction,
    handleReceiptTransaction,
    handleFormDataChange,
  } = useTransactionModals(() => fetchData(currentPage));

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

        {/* Pagination */}
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
          onFormDataChange={handleFormDataChange}
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
