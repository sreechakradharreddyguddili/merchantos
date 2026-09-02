const express = require("express");

const {
  registerMerchant,
  loginMerchant,
  getMerchantProfile,
  updateMerchantSettings,
} = require("../controllers/merchantController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  registerMerchant
);

router.post(
  "/login",
  loginMerchant
);

router.get(
  "/profile",
  protect,
  getMerchantProfile
);

router.patch(
  "/settings",
  protect,
  updateMerchantSettings
);

module.exports = router;