const AgentAction = require("../models/AgentAction");

// =====================================================
// EXECUTE AGENT ACTION
// =====================================================

const executeAgentAction = async (action) => {
  if (!action) {
    throw new Error("Agent action is required");
  }

  const requiresApproval =
    action.requiresApproval === true;

  // ---------------------------------------------------
  // Approval gate
  // ---------------------------------------------------

  if (
    requiresApproval &&
    action.status !== "approved"
  ) {
    throw new Error(
      `Only approved actions can be executed. Current status: ${action.status}`
    );
  }

  // ---------------------------------------------------
  // Low-risk actions
  // ---------------------------------------------------

  if (
    !requiresApproval &&
    action.status !== "pending"
  ) {
    throw new Error(
      `Low-risk action must be pending before execution. Current status: ${action.status}`
    );
  }

  // ---------------------------------------------------
  // Mark executing
  // ---------------------------------------------------

  action.status = "executing";

  await action.save();

  try {
    let result;

    switch (action.type) {
      case "conversion_experiment":
        result =
          await executeConversionExperiment(action);
        break;

      case "payment_recovery":
        result =
          await executePaymentRecovery(action);
        break;

      case "cross_sell":
        result =
          await executeCrossSell(action);
        break;

      case "inventory_replenishment":
        result =
          await executeInventoryReplenishment(action);
        break;

      case "campaign":
        result =
          await executeCampaign(action);
        break;

      case "ai_buyer_growth":
        result =
          await executeAIBuyerGrowth(action);
        break;

      default:
        throw new Error(
          `Unsupported agent action type: ${action.type}`
        );
    }

    // -------------------------------------------------
    // Successful execution
    // -------------------------------------------------

    action.status = "completed";

    action.executedAt = new Date();

    action.executionResult = {
      ...result,
      success: true,
      recovery: {
        available: true,
        strategy:
          result.recoveryStrategy ||
          "Retry safely using the same approved action.",
      },
    };

    await action.save();

    return action;
  } catch (error) {
    console.error(
      "Agent action execution failed:",
      error
    );

    // -----------------------------------------------
    // Graceful failure
    // -----------------------------------------------

    action.status = "failed";

    action.executionResult = {
      success: false,

      error: error.message,

      failedAt: new Date(),

      recovery: {
        available: true,

        strategy:
          "Action stopped safely without applying partial business changes.",

        nextStep:
          "Review the failure, correct the underlying condition, and retry the approved action.",
      },
    };

    await action.save();

    throw error;
  }
};

// =====================================================
// CONVERSION EXPERIMENT
// =====================================================

const executeConversionExperiment =
  async (action) => {
    return {
      success: true,

      mode: "simulation",

      action:
        "conversion_experiment",

      message:
        "Conversion experiment prepared successfully",

      experiment: {
        type:
          "checkout_conversion",

        status:
          "ready_for_execution",

        strategy:
          "Test checkout recovery and conversion improvements",

        requiresLiveExecution:
          true,
      },

      estimatedImpact:
        action.estimatedImpact,

      recoveryStrategy:
        "Retry the experiment after validating checkout configuration.",

      executedAt: new Date(),
    };
  };

// =====================================================
// PAYMENT RECOVERY
// =====================================================

const executePaymentRecovery =
  async (action) => {
    return {
      success: true,

      mode: "simulation",

      action:
        "payment_recovery",

      message:
        "Payment recovery workflow prepared",

      strategy: {
        type:
          "failed_payment_recovery",

        status:
          "ready_for_execution",

        requiresPaymentProvider:
          true,
      },

      recoveryStrategy:
        "Retry payment recovery through the payment provider after validation.",

      estimatedImpact:
        action.estimatedImpact,

      executedAt: new Date(),
    };
  };

// =====================================================
// CROSS SELL
// =====================================================

const executeCrossSell =
  async (action) => {
    return {
      success: true,

      mode: "simulation",

      action:
        "cross_sell",

      message:
        "Cross-sell recommendation prepared",

      strategy: {
        type:
          "product_recommendation",

        status:
          "ready_for_execution",

        requiresCustomerTargeting:
          true,
      },

      recoveryStrategy:
        "Retry targeting after validating product availability and customer eligibility.",

      executedAt: new Date(),
    };
  };

// =====================================================
// INVENTORY REPLENISHMENT
// =====================================================

const executeInventoryReplenishment =
  async (action) => {
    return {
      success: true,

      mode: "simulation",

      action:
        "inventory_replenishment",

      message:
        "Inventory replenishment recommendation prepared",

      strategy: {
        type:
          "inventory_reorder",

        status:
          "ready_for_execution",

        requiresSupplierIntegration:
          true,
      },

      recoveryStrategy:
        "Retry after supplier availability and stock thresholds are validated.",

      executedAt: new Date(),
    };
  };

// =====================================================
// CAMPAIGN
// =====================================================

const executeCampaign =
  async (action) => {
    return {
      success: true,

      mode: "simulation",

      action:
        "campaign",

      message:
        "Marketing campaign prepared",

      strategy: {
        type:
          "growth_campaign",

        status:
          "ready_for_execution",

        requiresMerchantCampaignApproval:
          true,
      },

      recoveryStrategy:
        "Retry after validating campaign configuration and merchant approval.",

      executedAt: new Date(),
    };
  };

// =====================================================
// AI BUYER GROWTH
// =====================================================

const executeAIBuyerGrowth =
  async (action) => {
    return {
      success: true,

      mode: "simulation",

      action:
        "ai_buyer_growth",

      message:
        "AI Buyer growth optimization prepared",

      strategy: {
        type:
          "ai_buyer_optimization",

        status:
          "ready_for_execution",

        channels: [
          "buyer_recommendation",
          "cross_sell",
          "merchant_growth_feedback",
        ],

        closedLoop:
          true,
      },

      recoveryStrategy:
        "Retry after validating AI Buyer catalog availability and recommendation inputs.",

      estimatedImpact:
        action.estimatedImpact,

      executedAt: new Date(),
    };
  };

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  executeAgentAction,
};