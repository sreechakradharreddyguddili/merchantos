const express = require("express");

const {
  recommendAIBuyerProducts,
  getAIBuyerCatalog,
  createAIBuyerOrder,
  createAIBuyerPayment,
  verifyAIBuyerPayment,
} = require("../controllers/aiBuyerController");

const router = express.Router();

// =====================================================
// AI BUYER RECOMMENDATIONS
// =====================================================

router.post(
  "/recommend",
  recommendAIBuyerProducts
);

// =====================================================
// AI BUYER CATALOG
// =====================================================

router.get(
  "/catalog",
  getAIBuyerCatalog
);

// =====================================================
// CREATE AI BUYER ORDER
// =====================================================

router.post(
  "/order",
  createAIBuyerOrder
);

// =====================================================
// CREATE RAZORPAY TEST ORDER
// =====================================================

router.post(
  "/payment",
  createAIBuyerPayment
);

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

router.post(
  "/verify",
  verifyAIBuyerPayment
);

module.exports = router;