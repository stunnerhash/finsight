# Transaction Components

This directory contains modular components for the transactions page, extracted from the original monolithic `transactions.tsx` file.

## Components

### TransactionHeader
- **Purpose**: Contains the navigation breadcrumb and page header with the add transaction button
- **Props**: `onAddTransaction` callback function
- **Features**: Back to dashboard link, page title, description, and add transaction button

### TransactionFilters
- **Purpose**: Handles search, type filtering, category filtering, and filter clearing
- **Props**: 
  - Filter state values (`searchTerm`, `selectedType`, `selectedCategory`)
  - `budgetCategories` array for category options
  - Callback functions for state changes
- **Features**: Search input, type dropdown, category dropdown, clear filters button

### TransactionsTable
- **Purpose**: Displays the transactions table with sortable columns
- **Props**:
  - `transactions` array
  - Sort state (`sortBy`, `sortOrder`)
  - `onSort` callback function
- **Features**: Sortable table headers, transaction rows, empty state message

### TransactionRow
- **Purpose**: Renders individual transaction rows
- **Props**: `transaction` object
- **Features**: Transaction details display with proper formatting and styling

### AddTransactionModal
- **Purpose**: Modal for adding new transactions
- **Props**:
  - Modal state (`isOpen`)
  - Form data and callback functions
  - `budgetCategories` for category selection
- **Features**: Form validation, category selection, type selection

### ReceiptUploadModal
- **Purpose**: Modal for uploading receipt photos and extracting bill amounts using OCR
- **Props**:
  - Modal state (`isOpen`)
  - `onClose` callback function
  - `onSubmit` callback function for transaction data
  - `budgetCategories` for category selection
- **Features**: 
  - Drag & drop file upload
  - OCR text extraction using Tesseract.js
  - Intelligent bill amount detection with regex patterns
  - Progress tracking during OCR processing
  - Pre-filled transaction form with extracted data
  - Support for multiple image formats (PNG, JPG, JPEG)

## Types

### BackendTransaction
Interface for transaction data from the backend:
```typescript
interface BackendTransaction {
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
```

### BackendBudgetCategory
Interface for budget category data:
```typescript
interface BackendBudgetCategory {
  id: number;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}
```

## OCR Features

The ReceiptUploadModal uses Tesseract.js for OCR processing and includes:

1. **Multi-pattern regex matching** for finding bill totals
2. **Currency symbol support** ($, €, £, ₹, ¥)
3. **International number format support** (1,234.56 or 1.234,56)
4. **Progress tracking** during OCR processing
5. **Error handling** for failed OCR attempts

## Usage Examples

### Basic Transaction Addition
```tsx
<AddTransactionModal
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  onSubmit={handleAddTransaction}
  formData={formData}
  onFormDataChange={handleFormDataChange}
  budgetCategories={budgetCategories}
/>
```

### Receipt Photo Upload
```tsx
<ReceiptUploadModal
  isOpen={showReceiptModal}
  onClose={() => setShowReceiptModal(false)}
  onSubmit={handleReceiptTransaction}
  budgetCategories={budgetCategories}
/>
```

## Benefits of Modularization

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the application
3. **Testing**: Easier to write unit tests for individual components
4. **Readability**: Main page is cleaner and easier to understand
5. **Type Safety**: Shared interfaces ensure consistency across components
