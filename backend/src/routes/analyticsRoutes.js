const express = require("express");

const {
  getOverview,
  getRevenueTrend,
  getProductPerformance,
  getPaymentAnalytics,
  getAIBuyerAnalytics,
} = require("../controllers/analyticsController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// =====================================================
// OVERVIEW
// =====================================================

router.get(
  "/overview",
  getOverview
);

// =====================================================
// REVENUE TREND
// =====================================================

router.get(
  "/revenue-trend",
  getRevenueTrend
);

// =====================================================
// PRODUCT PERFORMANCE
// =====================================================

router.get(
  "/product-performance",
  getProductPerformance
);

// =====================================================
// PAYMENT ANALYTICS
// =====================================================

router.get(
  "/payment-analytics",
  getPaymentAnalytics
);

// =====================================================
// AI BUYER ANALYTICS
// =====================================================

router.get(
  "/ai-buyer",
  getAIBuyerAnalytics
);

module.exports = router;