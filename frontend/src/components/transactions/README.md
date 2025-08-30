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

## Usage

The main transactions page now imports and uses these components:

```typescript
import {
  TransactionHeader,
  TransactionFilters,
  TransactionsTable,
  AddTransactionModal
} from '@/components/transactions';
```

## Benefits of Modularization

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the application
3. **Testing**: Easier to write unit tests for individual components
4. **Readability**: Main page is cleaner and easier to understand
5. **Type Safety**: Shared interfaces ensure consistency across components
