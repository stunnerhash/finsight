const { prisma } = require("../config/db");
const { ApiResponse } = require("../utils/ApiResponse");

const getBudgetCategories = async (req, res) => {
  try {
    // For now, get categories for the first user (you can add authentication later)
    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(404).json(ApiResponse.error("No user found"));
    }

    const categories = await prisma.budgetCategory.findMany({
      where: { userId: user.id },
      include: { transactions: true }
    });
    res.json(ApiResponse.success(categories));
  } catch (error) {
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

    const txs = await prisma.transaction.findMany({
      where: { userId: user.id }
    });

    const income = txs.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
    const expenses = txs.filter(t => t.type === "expense").reduce((a, b) => a + Math.abs(b.amount), 0);

    res.json(ApiResponse.success({
      income,
      expenses,
      savings: income - expenses
    }));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

module.exports = { getBudgetCategories, getStats };
