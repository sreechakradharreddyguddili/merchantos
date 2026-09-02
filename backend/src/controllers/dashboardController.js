const Merchant = require("../models/Merchant");
const GrowthAnalysis = require("../models/GrowthAnalysis");
const AgentAction = require("../models/AgentAction");


// =====================================================
// GET MERCHANT DASHBOARD
// =====================================================

const getDashboard = async (req, res) => {
  try {
    const merchantId = req.merchantId;

    // -----------------------------------------------
    // Merchant
    // -----------------------------------------------

    const merchant =
      await Merchant.findById(
        merchantId
      ).select(
        "businessName email phone businessType createdAt"
      );

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    // -----------------------------------------------
    // Latest AI analysis
    // -----------------------------------------------

    const latestAnalysis =
      await GrowthAnalysis.findOne({
        merchant: merchantId,
      }).sort({
        createdAt: -1,
      });

    // -----------------------------------------------
    // Pending actions
    // -----------------------------------------------

    const pendingActions =
      await AgentAction.find({
        merchant: merchantId,
        status: "pending",
      })
        .sort({
          createdAt: -1,
        })
        .limit(10)
        .select(
          "type title description priority estimatedImpact financialAction requiresApproval status createdAt"
        );

    // -----------------------------------------------
    // Action history
    // -----------------------------------------------

    const actionHistory =
      await AgentAction.find({
        merchant: merchantId,
        status: {
          $in: [
            "completed",
            "rejected",
            "failed",
          ],
        },
      })
        .sort({
          updatedAt: -1,
        })
        .limit(10)
        .select(
          "type title priority financialAction requiresApproval status approvedAt rejectedAt executedAt executionResult createdAt updatedAt"
        );

    // -----------------------------------------------
    // Action statistics
    // -----------------------------------------------

    const [
      totalActions,
      pendingCount,
      completedCount,
      rejectedCount,
      failedCount,
    ] = await Promise.all([
      AgentAction.countDocuments({
        merchant: merchantId,
      }),

      AgentAction.countDocuments({
        merchant: merchantId,
        status: "pending",
      }),

      AgentAction.countDocuments({
        merchant: merchantId,
        status: "completed",
      }),

      AgentAction.countDocuments({
        merchant: merchantId,
        status: "rejected",
      }),

      AgentAction.countDocuments({
        merchant: merchantId,
        status: "failed",
      }),
    ]);

    // -----------------------------------------------
    // Dashboard response
    // -----------------------------------------------

    return res.status(200).json({
      success: true,

      data: {
        merchant,

        overview: {
          businessHealth:
            latestAnalysis?.businessHealth ||
            "unknown",

          analysisCreatedAt:
            latestAnalysis?.createdAt ||
            null,

          totalActions,

          pendingActions:
            pendingCount,

          completedActions:
            completedCount,

          rejectedActions:
            rejectedCount,

          failedActions:
            failedCount,
        },

        latestAnalysis,

        pendingActions,

        actionHistory,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load dashboard",
      error:
        error.message,
    });
  }
};


module.exports = {
  getDashboard,
};