const express = require("express");

const {
  getAnalysisHistory,
  getLatestAnalysis,
} = require(
  "../controllers/growthAnalysisController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);


const router = express.Router();


router.use(protect);


router.get(
  "/history",
  getAnalysisHistory
);


router.get(
  "/latest",
  getLatestAnalysis
);


module.exports = router;