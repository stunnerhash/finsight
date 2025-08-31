const { Router } = require("express");
const { getBudgetCategories, getStats, updateBudgetCategory } = require("../controllers/budgetController");

const router = Router();

router.get("/categories", getBudgetCategories);
router.get("/stats", getStats);
router.put("/categories/:id", updateBudgetCategory);

module.exports = router;
