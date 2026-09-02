const express = require("express");

const {
  analyzeGrowth,
  getAgentHealth,
} = require("../controllers/agentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get(
  "/health",
  getAgentHealth
);

router.post(
  "/analyze",
  analyzeGrowth
);

module.exports = router;