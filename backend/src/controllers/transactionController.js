const { prisma } = require("../config/db");
const { ApiResponse } = require("../utils/ApiResponse");

const getTransactions = async (req, res) => {
  try {
    // For now, get transactions for the first user
    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(404).json(ApiResponse.error("No user found"));
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 10,
      include: { category: true }
    });
    res.json(ApiResponse.success(transactions));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

const addTransaction = async (req, res) => {
  try {
    const { title, amount, categoryId, type } = req.body;

    if (!title || !amount || !categoryId || !type) {
      return res.status(400).json(ApiResponse.error("Missing required fields"));
    }

    // For now, use the first user (you can add authentication later)
    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(404).json(ApiResponse.error("No user found"));
    }

    const tx = await prisma.transaction.create({
      data: { 
        title, 
        amount, 
        categoryId, 
        type,
        userId: user.id
      }
    });

    // Update budget category spent amount
    if (type === 'expense') {
      await prisma.budgetCategory.update({
        where: { id: categoryId },
        data: { spent: { increment: Math.abs(amount) } }
      });
    }

    res.status(201).json(ApiResponse.success(tx));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

module.exports = { getTransactions, addTransaction };
