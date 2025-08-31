# FinSight Technical Architecture

This document provides a detailed technical overview of the FinSight application architecture, including design patterns, data flow, and implementation details.

## 🏗️ System Overview

FinSight is a full-stack personal finance management application built with a modern JavaScript/TypeScript stack. The application follows a client-server architecture with a React frontend and Node.js backend.

## 📊 Database Design

### Schema Overview
The database uses PostgreSQL with Prisma ORM for type-safe database operations. The schema consists of three main entities:

1. **User** - Core user entity
2. **BudgetCategory** - Budget categories for organizing expenses
3. **Transaction** - Individual financial transactions

### Relationships
- **User → BudgetCategory**: One-to-Many (a user can have multiple budget categories)
- **User → Transaction**: One-to-Many (a user can have multiple transactions)
- **BudgetCategory → Transaction**: One-to-Many (a category can have multiple transactions)

### Key Design Decisions
- **Soft deletes**: Not implemented (transactions are permanent)
- **Audit trail**: Basic with `createdAt` and `updatedAt` timestamps
- **Data validation**: Handled at both application and database levels

## 🎨 Frontend Architecture

### Component Architecture

The frontend follows a modular component architecture with clear separation of concerns:

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI base components
│   ├── dashboard/      # Dashboard-specific components
│   ├── transactions/   # Transaction management
│   └── charts/         # Data visualization
├── hooks/              # Custom React hooks
├── pages/              # Page-level components
├── services/           # API and business logic
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

### State Management Strategy

The application uses a **custom hooks pattern** for state management:

#### Custom Hooks
- **`useDashboard`**: Manages dashboard data and period selection
- **`useTransactions`**: Handles transaction CRUD operations and filtering
- **`useDashboardModals`**: Manages modal states for dashboard
- **`useTransactionModals`**: Manages modal states for transactions
- **`useChartData`**: Handles chart data fetching and caching

#### Benefits
- **Separation of concerns**: Business logic separated from UI
- **Reusability**: Hooks can be shared across components
- **Testability**: Logic can be tested independently
- **Performance**: Optimized re-renders with proper dependencies

### Data Flow

```
User Action → Component → Custom Hook → API Service → Backend
                ↓
            State Update → Re-render → UI Update
```

### Performance Optimizations

1. **Memoization**: `useMemo` for expensive calculations
2. **Optimized re-renders**: Proper dependency arrays in hooks
3. **Client-side filtering**: Search and category filtering done locally
4. **Pagination**: Server-side pagination for large datasets
5. **Loading states**: Granular loading indicators

## 🔧 Backend Architecture

### API Design

The backend follows RESTful API principles with the following structure:

```
/api/
├── transactions/       # Transaction management
├── budget/
│   └── categories/    # Budget category management
└── dashboard/         # Dashboard data
```

### Controller Pattern

Controllers handle HTTP requests and delegate business logic:

```javascript
// Example: transactionController.js
const getTransactions = async (req, res) => {
  try {
    const { page, limit, type, search } = req.query;
    const transactions = await prisma.transaction.findMany({
      where: { /* filters */ },
      include: { category: true },
      skip: (page - 1) * limit,
      take: limit
    });
    res.json(ApiResponse.success(transactions));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};
```

### Error Handling

- **Consistent error responses**: All errors use `ApiResponse` format
- **HTTP status codes**: Proper status codes for different error types
- **Error logging**: Console logging for debugging
- **User-friendly messages**: Sanitized error messages for users

### Database Operations

- **Prisma ORM**: Type-safe database operations
- **Transactions**: Used for complex operations requiring consistency
- **Relationships**: Properly handled with `include` and `select`
- **Pagination**: Efficient pagination with `skip` and `take`

## 🔄 Data Flow Patterns

### Optimistic Updates

For better user experience, the application uses optimistic updates:

```typescript
// Example: Adding a transaction
const handleAddTransaction = async (transactionData) => {
  // Optimistically add to UI
  setTransactions(prev => [...prev, newTransaction]);
  
  try {
    // Send to server
    await api.addTransaction(transactionData);
    // Refresh data to ensure consistency
    refreshData();
  } catch (error) {
    // Rollback on error
    setTransactions(prev => prev.filter(t => t.id !== newTransaction.id));
    showError(error);
  }
};
```

### Caching Strategy

- **Client-side caching**: Recent data cached in component state
- **No server-side caching**: Currently using direct database queries
- **Cache invalidation**: Manual refresh after mutations

## 🎯 Design Patterns

### Custom Hooks Pattern

```typescript
// Example: useTransactions hook
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    transactions,
    loading,
    fetchTransactions,
    // ... other state and actions
  };
};
```

### Component Composition

```typescript
// Example: Dashboard composition
const Dashboard = () => {
  const { data, loading } = useDashboard();
  
  if (loading) return <Loading />;
  
  return (
    <div>
      <DashboardHeader />
      <StatsSection data={data.stats} />
      <BudgetCategoriesSection data={data.categories} />
      <AnalyticsSection data={data.charts} />
    </div>
  );
};
```

### Service Layer Pattern

```typescript
// Example: financeService.ts
export class FinanceService {
  async getTransactions(params) {
    return this.apiService.get('/transactions', { params });
  }
  
  async addTransaction(data) {
    return this.apiService.post('/transactions', data);
  }
}
```