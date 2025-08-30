const { Router } = require("express");
const { getBudgetCategories, getStats } = require("../controllers/budgetController");

const router = Router();

router.get("/categories", getBudgetCategories);
router.get("/stats", getStats);

module.exports = router;
