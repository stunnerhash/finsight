const { prisma } = require("../config/db");
const { ApiResponse } = require("../utils/ApiResponse");

const getBudgetCategories = async (req, res) => {
  try {
    // For now, get categories for the first user (you can add authentication later)
    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(404).json(ApiResponse.error("No user found"));
    }

    const { period = 'current' } = req.query;
    
    // Get all categories with their transactions
    const categories = await prisma.budgetCategory.findMany({
      where: { userId: user.id },
      include: { transactions: true }
    });

    const now = new Date();
    let targetMonth, targetYear;

    // Determine the target period based on the query parameter
    switch (period) {
      case 'previous':
        // Previous month
        targetMonth = now.getMonth() - 1;
        targetYear = now.getFullYear();
        break;
      case 'yearly':
        // This year
        targetMonth = 0; // January
        targetYear = now.getFullYear();
        break;
      default:
        // Current month (default)
        targetMonth = now.getMonth();
        targetYear = now.getFullYear();
    }

    // Calculate period start and end dates
    const periodStart = new Date(targetYear, targetMonth, 1);
    const periodEnd = period === 'yearly' 
      ? new Date(targetYear, 11, 31, 23, 59, 59) // End of year
      : new Date(targetYear, targetMonth + 1, 0, 23, 59, 59); // End of month

    // Process each category to calculate period-specific spent amounts
    const processedCategories = categories.map(category => {
      // Filter transactions for this category within the selected period
      const periodTransactions = category.transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= periodStart && txDate <= periodEnd && tx.type === 'expense';
      });

      // Calculate spent amount for this period
      const periodSpent = periodTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

      return {
        ...category,
        spent: periodSpent, // Override the spent amount with period-specific amount
        transactions: periodTransactions // Only include transactions from this period
      };
    });

    res.json(ApiResponse.success(processedCategories));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

const updateBudgetCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { budgeted, name, color } = req.body;

    // For now, get the first user (you can add authentication later)
    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(404).json(ApiResponse.error("No user found"));
    }

    // Update the budget category
    const updatedCategory = await prisma.budgetCategory.update({
      where: { 
        id: parseInt(id),
        userId: user.id // Ensure the category belongs to the user
      },
      data: {
        ...(budgeted !== undefined && { budgeted: parseFloat(budgeted) }),
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color })
      },
      include: { transactions: true }
    });

    res.json(ApiResponse.success(updatedCategory));
  } catch (error) {
    console.error('Error updating budget category:', error);
    res.status(500).json(ApiResponse.error(error.message));
  }
};

const getStats = async (req, res) => {
  try {
    // For now, get stats for the first user
    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(404).json(ApiResponse.error("No user found"));
    }

    const { period = 'current' } = req.query;
    const txs = await prisma.transaction.findMany({
      where: { userId: user.id }
    });

    const now = new Date();
    let targetMonth, targetYear;
    let comparisonMonth, comparisonYear;

    // Determine the target period based on the query parameter
    switch (period) {
      case 'previous':
        // Previous month
        targetMonth = now.getMonth() - 1;
        targetYear = now.getFullYear();
        comparisonMonth = now.getMonth() - 2;
        comparisonYear = now.getFullYear();
        break;
      case 'yearly':
        // This year
        targetMonth = 0; // January
        targetYear = now.getFullYear();
        comparisonMonth = 0; // January of previous year
        comparisonYear = now.getFullYear() - 1;
        break;
      default:
        // Current month (default)
        targetMonth = now.getMonth();
        targetYear = now.getFullYear();
        comparisonMonth = now.getMonth() - 1;
        comparisonYear = now.getFullYear();
    }

    // Calculate target period stats
    const targetStart = new Date(targetYear, targetMonth, 1);
    const targetEnd = period === 'yearly' 
      ? new Date(targetYear, 11, 31, 23, 59, 59) // End of year
      : new Date(targetYear, targetMonth + 1, 0, 23, 59, 59); // End of month
    
    const targetTxs = txs.filter(t => {
      const txDate = new Date(t.date);
      return txDate >= targetStart && txDate <= targetEnd;
    });
    
    const targetIncome = targetTxs.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
    const targetExpenses = targetTxs.filter(t => t.type === "expense").reduce((a, b) => a + Math.abs(b.amount), 0);
    const targetSavings = targetIncome - targetExpenses;

    // Calculate comparison period stats
    const comparisonStart = new Date(comparisonYear, comparisonMonth, 1);
    const comparisonEnd = period === 'yearly'
      ? new Date(comparisonYear, 11, 31, 23, 59, 59) // End of year
      : new Date(comparisonYear, comparisonMonth + 1, 0, 23, 59, 59); // End of month
    
    const comparisonTxs = txs.filter(t => {
      const txDate = new Date(t.date);
      return txDate >= comparisonStart && txDate <= comparisonEnd;
    });
    
    const comparisonIncome = comparisonTxs.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
    const comparisonExpenses = comparisonTxs.filter(t => t.type === "expense").reduce((a, b) => a + Math.abs(b.amount), 0);
    const comparisonSavings = comparisonIncome - comparisonExpenses;

    // Calculate changes
    const incomeChange = comparisonIncome > 0 ? ((targetIncome - comparisonIncome) / comparisonIncome) * 100 : 0;
    const expensesChange = comparisonExpenses > 0 ? ((targetExpenses - comparisonExpenses) / comparisonExpenses) * 100 : 0;
    const savingsChange = comparisonSavings > 0 ? ((targetSavings - comparisonSavings) / comparisonSavings) * 100 : 0;

    res.json(ApiResponse.success({
      current: {
        income: targetIncome,
        expenses: targetExpenses,
        savings: targetSavings
      },
      previous: {
        income: comparisonIncome,
        expenses: comparisonExpenses,
        savings: comparisonSavings
      },
      changes: {
        income: incomeChange,
        expenses: expensesChange,
        savings: savingsChange
      }
    }));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

module.exports = { getBudgetCategories, getStats, updateBudgetCategory };
