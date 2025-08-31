const { prisma } = require("../config/db");
const { ApiResponse } = require("../utils/ApiResponse");

const getTransactions = async (req, res) => {
  try {
    // For now, get transactions for the first user
    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(404).json(ApiResponse.error("No user found"));
    }

    const { 
      period = 'current',
      page = 1,
      limit = 10,
      type,
      search,
      startDate,
      endDate
    } = req.query;
    
    // Parse pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
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

    // Build where clause
    const whereClause = {
      userId: user.id,
      date: {
        gte: startDate ? new Date(startDate) : periodStart,
        lte: endDate ? new Date(endDate) : periodEnd
      }
    };

    // Add type filter if provided
    if (type && (type === 'income' || type === 'expense')) {
      whereClause.type = type;
    }

    // Add search filter if provided
    if (search && search.trim()) {
      whereClause.title = {
        contains: search.trim(),
        mode: 'insensitive' // Case-insensitive search
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.transaction.count({
      where: whereClause
    });

    // Get paginated transactions
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      skip: skip,
      take: limitNum,
      include: { category: true }
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json(ApiResponse.success({
      transactions,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNum
      }
    }));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

const addTransaction = async (req, res) => {
  try {
    const { title, amount, categoryId, type } = req.body;

    if (!title || !amount || !type) {
      return res.status(400).json(ApiResponse.error("Missing required fields"));
    }

    // Only require categoryId for expenses
    if (type === 'expense' && !categoryId) {
      return res.status(400).json(ApiResponse.error("Category is required for expenses"));
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
        categoryId: type === 'expense' ? categoryId : null, 
        type,
        userId: user.id
      }
    });

    // Update budget category spent amount only for expenses
    if (type === 'expense' && categoryId) {
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
