const { Router } = require("express");
const { getTransactions, addTransaction } = require("../controllers/transactionController");

const router = Router();

router.get("/", getTransactions);
router.post("/", addTransaction);

module.exports = router;
