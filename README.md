# FinSight - Personal Finance Management Application

A personal finance management application built with React, TypeScript, Node.js, and PostgreSQL. Track your income, expenses, budget categories, and visualize your financial data with interactive charts.

## 🚀 Features

### Core Functionality
- **Transaction Management**: Add, view, and categorize income and expenses
- **Budget Categories**: Create and manage budget categories with spending limits
- **Receipt Upload**: Upload receipts for automatic transaction processing
- **Analytics Dashboard**: Visualize spending patterns with interactive charts
- **Real-time Updates**: Live updates across all components

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with Shadcn UI components
- **Fast Performance**: Optimized data fetching and client-side filtering
- **Type Safety**: Full TypeScript support for better development experience

## 🏗️ Architecture

### Database Schema

The application uses a relational database with the following core entities:

![Database Schema](assets/erd.png)

#### Core Tables

1. **User Table**
   - Stores user account information
   - Fields: `id`, `email`, `name`, `createdAt`, `updatedAt`

2. **BudgetCategory Table**
   - Manages budget categories (e.g., "Groceries", "Rent", "Entertainment")
   - Fields: `id`, `name`, `budgeted`, `spent`, `color`, `userId`, `createdAt`, `updatedAt`
   - Relationship: One-to-Many with User

3. **Transaction Table**
   - Stores individual financial transactions
   - Fields: `id`, `title`, `amount`, `type`, `date`, `userId`, `categoryId`
   - Relationships: Many-to-One with User and BudgetCategory

### Frontend Architecture

```
frontend/src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── transactions/    # Transaction management components
│   └── charts/          # Data visualization components
├── hooks/               # Custom React hooks
│   ├── useDashboard.ts  # Dashboard data management
│   ├── useTransactions.ts # Transaction logic
│   ├── useDashboardModals.ts # Modal state management
│   ├── useTransactionModals.ts # Transaction modal logic
│   └── useChartData.ts  # Chart data management
├── pages/               # Page components
│   ├── dashboard.tsx    # Main dashboard
│   └── transactions.tsx # Transaction management
├── services/            # API and business logic
│   ├── api.ts          # API client
│   └── financeService.ts # Finance-specific services
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

### Backend Architecture

```
backend/src/
├── controllers/         # Request handlers
│   ├── transactionController.js
│   └── budgetController.js
├── routes/              # API route definitions
│   ├── transactionRoute.js
│   └── budgetRoute.js
├── models/              # Data models (Prisma)
├── config/              # Configuration files
├── middlewares/         # Express middlewares
└── utils/               # Utility functions
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Shadcn UI** - Component library
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication (planned)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/stunnerhash/finsight.git
cd finsight
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Database Setup
```bash
# Navigate to backend directory
cd backend

# Set up your database URL in .env
echo "DATABASE_URL=\"postgresql://username:password@localhost:5432/finsight\"" > .env

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### 4. Environment Configuration

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/finsight"
PORT=3001
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

### 5. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🚀 Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
```

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## 📚 API Documentation

### Transactions
- `GET /api/transactions` - Get paginated transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budget Categories
- `GET /api/budget/categories` - Get budget categories
- `POST /api/budget/categories` - Create budget category
- `PUT /api/budget/categories/:id` - Update budget category
- `DELETE /api/budget/categories/:id` - Delete budget category

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-transactions` - Get recent transactions

## 🎨 Component Architecture

### Custom Hooks Pattern
The application uses custom hooks to separate business logic from UI components:

```typescript
// Example: useTransactions hook
const {
  transactions,
  loading,
  error,
  handleAddTransaction,
  handleSearchChange,
  // ... other state and actions
} = useTransactions();
```

### Component Composition
Components are designed to be composable and focused on single responsibilities:

```typescript
// Example: Dashboard page composition
<Dashboard>
  <DashboardHeader />
  <StatsSection />
  <BudgetCategoriesSection />
  <AnalyticsSection />
</Dashboard>
```

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Structure
- Keep components focused on single responsibilities
- Use custom hooks for business logic
- Implement proper error boundaries
- Use TypeScript interfaces for props

### State Management
- Use React hooks for local state
- Implement proper loading and error states
- Use optimistic updates where appropriate
- Cache data to improve performance

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# The build output will be in the dist/ directory
```

### Backend Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start
```
