const express = require("express");

const {
  createActionsFromAnalysis,
  getPendingActions,
  getActionHistory,
  approveAction,
  rejectAction,
} = require("../controllers/agentActionController");

const {
  executeAction,
} = require("../controllers/agentExecutionController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router =
  express.Router();


// =====================================================
// AUTHENTICATION
// =====================================================

router.use(protect);


// =====================================================
// ACTION ROUTES
// =====================================================

// Generate actions
router.post(
  "/generate",
  createActionsFromAnalysis
);

// Pending actions
router.get(
  "/pending",
  getPendingActions
);

// Action history
router.get(
  "/history",
  getActionHistory
);

// Approve action
router.patch(
  "/:id/approve",
  approveAction
);

// Reject action
router.patch(
  "/:id/reject",
  rejectAction
);

// Execute action
router.patch(
  "/:id/execute",
  executeAction
);


module.exports = router;