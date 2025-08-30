# Dashboard Components

This directory contains all the modular components for the Finance Dashboard.

## Component Structure

### Core Components
- **StatCard** - Individual stat card with progress bars, trends, and visibility toggle
- **BudgetCategoryItem** - Individual budget category item with progress visualization
- **TransactionItem** - Individual transaction item with type indicators

### Section Components
- **DashboardHeader** - Main dashboard header with title and action buttons
- **StatsSection** - Grid container for all stat cards
- **BudgetCategoriesSection** - Container for budget categories with header
- **RecentTransactionsSection** - Container for recent transactions with header

### Layout
- **StatsSection** - 4-column grid (responsive: 1 col mobile, 2 cols tablet, 4 cols desktop)
- **Main Content** - 3-column grid with budget categories taking 2 columns and transactions taking 1 column

## Usage

```tsx
import { 
  DashboardHeader,
  StatsSection,
  BudgetCategoriesSection,
  RecentTransactionsSection
} from '@/components/dashboard';

// Use in your dashboard page
<DashboardHeader 
  selectedPeriod={selectedPeriod}
  onAddTransaction={handleAddTransaction}
  onPeriodChange={handlePeriodChange}
/>
```

## Props

All components use TypeScript interfaces defined in `@/types/finance.ts` for type safety.

## Styling

Components use Tailwind CSS classes and follow the design system defined in the UI components.
