const AgentAction = require("../models/AgentAction");
const GrowthAnalysis = require("../models/GrowthAnalysis");

const {
  evaluateActionPolicy,
} = require("../services/agentPolicyService");

// =========================================================
// AUDIT HELPER
// =========================================================

const appendAuditEvent = (
  action,
  {
    event,
    fromStatus = null,
    toStatus = null,
    actor,
    reason = "",
    metadata = null,
  }
) => {
  if (!Array.isArray(action.auditTrail)) {
    action.auditTrail = [];
  }

  action.auditTrail.push({
    event,
    fromStatus,
    toStatus,
    actor,
    reason,
    timestamp: new Date(),
    metadata,
  });
};

// =========================================================
// CREATE ACTIONS FROM ANALYSIS
// =========================================================

const createActionsFromAnalysis =
  async (req, res) => {
    try {
      const merchantId =
        req.merchantId;

      const analysisId =
        req.body?.analysisId;

      const recommendationId =
        req.body?.recommendationId ||
        null;

      if (!analysisId) {
        return res.status(400).json({
          success: false,
          message:
            "Analysis ID is required",
        });
      }

      const analysis =
        await GrowthAnalysis.findOne({
          _id: analysisId,
          merchant: merchantId,
        });

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message:
            "Growth analysis not found",
        });
      }

      let recommendations =
        Array.isArray(
          analysis.recommendations
        )
          ? analysis.recommendations
          : [];

      // =====================================================
      // SPECIFIC RECOMMENDATION
      // =====================================================

      if (recommendationId) {
        recommendations =
          recommendations.filter(
            (recommendation) =>
              String(
                recommendation?.id ||
                  ""
              ) ===
              String(
                recommendationId
              )
          );

        if (
          recommendations.length ===
          0
        ) {
          return res.status(404).json({
            success: false,
            message:
              "Recommendation not found",
          });
        }
      }

      if (
        recommendations.length ===
        0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No recommendations available",
        });
      }

      const actions = [];

      for (
        const recommendation of
          recommendations
      ) {
        // =====================================================
        // DETERMINE ACTION TYPE
        // =====================================================

        let type =
          "campaign";

        const recommendationKey =
          recommendation?.id ||
          "";

        switch (
          recommendationKey
        ) {
          case "PAYMENT_RECOVERY":
            type =
              "payment_recovery";
            break;

          case "CONVERSION_EXPERIMENT":
            type =
              "conversion_experiment";
            break;

          case "SMART_CROSS_SELL":
            type =
              "cross_sell";
            break;

          case "INVENTORY_REPLENISHMENT":
            type =
              "inventory_replenishment";
            break;

          case "CAMPAIGN":
            type =
              "campaign";
            break;

          case "AI_BUYER_GROWTH":
            type =
              "ai_buyer_growth";
            break;

          default:
            type =
              "campaign";
        }

        // =====================================================
        // CROSS-SELL DETAILS
        // =====================================================

        const primaryProduct =
          recommendation
            ?.primary_product ||
          recommendation
            ?.cross_sell_details
            ?.primary_product ||
          null;

        const complementaryProduct =
          recommendation
            ?.complementary_product ||
          recommendation
            ?.cross_sell_details
            ?.complementary_product ||
          recommendation?.product ||
          null;

        const crossSellReasons =
          Array.isArray(
            recommendation
              ?.cross_sell_details
              ?.reasons
          )
            ? recommendation
                .cross_sell_details
                .reasons
            : [];

        // =====================================================
        // DUPLICATE ACTIVE ACTION PROTECTION
        // =====================================================

        const resolvedCrossSellProductId =
          type === "cross_sell" &&
          complementaryProduct
            ? await resolveProductId(
                complementaryProduct,
                merchantId
              )
            : null;

        const existing =
          await AgentAction.findOne({
            merchant:
              merchantId,

            type,

            status: {
              $in: [
                "pending",
                "approved",
                "executing",
              ],
            },

            ...(type ===
              "cross_sell" &&
            resolvedCrossSellProductId
              ? {
                  product:
                    resolvedCrossSellProductId,
                }
              : {}),
          });

        /*
         * If we were unable to resolve the product
         * for a cross-sell action, fall back to the
         * original merchant + type protection.
         */

        let fallbackExisting =
          null;

        if (
          type ===
            "cross_sell" &&
          !existing
        ) {
          fallbackExisting =
            await AgentAction.findOne({
              merchant:
                merchantId,

              type,

              status: {
                $in: [
                  "pending",
                  "approved",
                  "executing",
                ],
              },
            });
        }

        const activeExisting =
          existing ||
          fallbackExisting;

        if (activeExisting) {
          actions.push({
            ...activeExisting.toObject(),

            alreadyExists:
              true,
          });

          continue;
        }

        // =====================================================
        // POLICY
        // =====================================================

        const financialAction =
          recommendation
            ?.financial_action ===
          true;

        const policy =
          evaluateActionPolicy({
            type,
            financialAction,
          });

        // =====================================================
        // ESTIMATED IMPACT
        // =====================================================

        const estimatedImpact =
          Number(
            recommendation
              ?.estimated_impact ||
              0
          );

        // =====================================================
        // ACTION DESCRIPTION
        // =====================================================

        let description =
          recommendation
            ?.reason ||
          "AI-generated growth action.";

        if (
          type ===
            "cross_sell" &&
          primaryProduct &&
          complementaryProduct
        ) {
          const reasonText =
            crossSellReasons
              .filter(Boolean)
              .join(" ");

          description =
            `Recommend ${complementaryProduct} to customers considering ${primaryProduct}.`;

          if (reasonText) {
            description +=
              ` Reason: ${reasonText}`;
          }

          if (
            estimatedImpact >
            0
          ) {
            description +=
              ` Estimated revenue opportunity: ₹${estimatedImpact.toLocaleString(
                "en-IN"
              )}.`;
          }
        }

        // =====================================================
        // DECISION EVIDENCE
        // =====================================================

        const evidence = [];

        if (
          recommendation
            ?.reason
        ) {
          evidence.push(
            String(
              recommendation.reason
            )
          );
        }

        if (
          Array.isArray(
            recommendation
              ?.recommended_actions
          )
        ) {
          recommendation
            .recommended_actions
            .filter(Boolean)
            .slice(0, 5)
            .forEach(
              (item) =>
                evidence.push(
                  String(item)
                )
            );
        }

        if (
          recommendation
            ?.current_revenue !==
          undefined
        ) {
          evidence.push(
            `Current AI Buyer revenue: ₹${Number(
              recommendation.current_revenue ||
                0
            ).toLocaleString(
              "en-IN"
            )}.`
          );
        }

        if (
          recommendation
            ?.current_revenue_share !==
          undefined
        ) {
          evidence.push(
            `Current AI Buyer revenue share: ${Number(
              recommendation.current_revenue_share ||
                0
            ).toFixed(2)}%.`
          );
        }

        if (
          evidence.length ===
          0
        ) {
          evidence.push(
            "Agent recommendation generated from merchant business data."
          );
        }

        const sourceChannel =
          type ===
          "ai_buyer_growth"
            ? "ai_buyer"
            : "growth_agent";

        const expectedOutcome =
          recommendation
            ?.action ||
          "Improve merchant growth performance.";

        // =====================================================
        // CREATE ACTION
        // =====================================================

        const action =
          await AgentAction.create({
            merchant:
              merchantId,

            analysis:
              analysis._id,

            type,

            title:
              recommendation
                ?.action ||
              "AI Growth Action",

            description,

            priority:
              recommendation
                ?.priority ||
              "MEDIUM",

            product:
              (
                type ===
                  "cross_sell"
                  ? resolvedCrossSellProductId
                  : await resolveProductId(
                      recommendation
                        ?.product,
                      merchantId
                    )
              ) ||
              null,

            estimatedImpact,

            financialAction,

            /*
             * Merchant approval is always required
             * before execution.
             */

            requiresApproval:
              true,

            // =================================================
            // POLICY SNAPSHOT
            // =================================================

            policyDecision: {
              risk:
                policy?.risk ||
                "LOW",

              reason:
                policy?.reason ||
                "Action evaluated by MerchantOS policy engine.",

              evaluatedAt:
                new Date(),
            },

            // =================================================
            // DECISION EVIDENCE
            // =================================================

            decisionEvidence: {
              trigger:
                recommendation
                  ?.id ||
                "GROWTH_RECOMMENDATION",

              evidence,

              recommendationId:
                recommendation
                  ?.id ||
                "",

              sourceChannel,

              expectedOutcome,

              estimatedImpact,

              recordedAt:
                new Date(),
            },

            // =================================================
            // CROSS-SELL DETAILS
            // =================================================

            crossSellDetails:
              type ===
              "cross_sell"
                ? {
                    primaryProduct:
                      primaryProduct ||
                      "",
                    complementaryProduct:
                      complementaryProduct ||
                      "",
                    reasons:
                      crossSellReasons,
                  }
                : {
                    primaryProduct:
                      "",
                    complementaryProduct:
                      "",
                    reasons: [],
                  },

            // =================================================
            // STATUS
            // =================================================

            status:
              "pending",

            // =================================================
            // INITIAL AUDIT EVENT
            // =================================================

            auditTrail: [
              {
                event:
                  "recommendation_created",

                fromStatus:
                  null,

                toStatus:
                  "pending",

                actor:
                  "ai_agent",

                reason:
                  recommendation
                    ?.reason ||
                  "AI growth recommendation converted into an agent action.",

                timestamp:
                  new Date(),

                metadata: {
                  recommendationId:
                    recommendation
                      ?.id ||
                    "",

                  sourceChannel,

                  risk:
                    policy?.risk ||
                    "LOW",

                  requiresApproval:
                    true,

                  estimatedImpact,
                },
              },
            ],
          });

        actions.push({
          ...action.toObject(),

          alreadyExists:
            false,

          risk:
            policy?.risk ||
            "LOW",

          policyReason:
            policy?.reason ||
            "",

          automaticallyExecuted:
            false,

          crossSellDetails:
            type ===
            "cross_sell"
              ? {
                  primaryProduct,
                  complementaryProduct,
                  reasons:
                    crossSellReasons,
                }
              : null,
        });
      }

      // =====================================================
      // RESPONSE MESSAGE
      // =====================================================

      const hasNewAction =
        actions.some(
          (action) =>
            !action.alreadyExists
        );

      const hasExistingAction =
        actions.some(
          (action) =>
            action.alreadyExists
        );

      let message =
        "Agent action created successfully";

      if (
        hasExistingAction &&
        !hasNewAction
      ) {
        message =
          "An active action already exists for this recommendation.";
      }

      if (
        hasExistingAction &&
        hasNewAction
      ) {
        message =
          "Action created successfully. Existing active actions were skipped.";
      }

      return res.status(201).json({
        success: true,

        message,

        data: {
          actions,

          count:
            actions.length,
        },
      });
    } catch (error) {
      console.error(
        "Create agent actions error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to create agent actions",

        error:
          error.message,
      });
    }
  };

// =========================================================
// RESOLVE PRODUCT ID
// =========================================================

const resolveProductId =
  async (
    productName,
    merchantId
  ) => {
    if (!productName) {
      return null;
    }

    try {
      const Product =
        require("../models/Product");

      const product =
        await Product.findOne({
          merchant:
            merchantId,

          name:
            productName,

          isActive:
            true,
        }).select("_id");

      return (
        product?._id ||
        null
      );
    } catch (error) {
      console.error(
        "Resolve product error:",
        error
      );

      return null;
    }
  };

// =========================================================
// GET PENDING ACTIONS
// =========================================================

const getPendingActions =
  async (req, res) => {
    try {
      const actions =
        await AgentAction.find({
          merchant:
            req.merchantId,

          status: {
            $in: [
              "pending",
              "approved",
            ],
          },
        })
          .sort({
            createdAt: -1,
          })
          .populate(
            "analysis",
            "businessHealth createdAt"
          )
          .populate(
            "product",
            "name price sku"
          );

      return res.status(200).json({
        success: true,

        data: {
          actions,

          count:
            actions.length,
        },
      });
    } catch (error) {
      console.error(
        "Get pending actions error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch pending actions",

        error:
          error.message,
      });
    }
  };

// =========================================================
// GET HISTORY
// =========================================================

const getActionHistory =
  async (req, res) => {
    try {
      const actions =
        await AgentAction.find({
          merchant:
            req.merchantId,

          status: {
            $in: [
              "completed",
              "rejected",
              "failed",
              "cancelled",
            ],
          },
        })
          .sort({
            updatedAt: -1,
          })
          .populate(
            "analysis",
            "businessHealth createdAt"
          )
          .populate(
            "product",
            "name price sku"
          );

      return res.status(200).json({
        success: true,

        data: {
          actions,

          count:
            actions.length,
        },
      });
    } catch (error) {
      console.error(
        "Get action history error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch action history",

        error:
          error.message,
      });
    }
  };

// =========================================================
// APPROVE
// =========================================================

const approveAction =
  async (req, res) => {
    try {
      const action =
        await AgentAction.findOne({
          _id:
            req.params.id,

          merchant:
            req.merchantId,
        });

      if (!action) {
        return res.status(404).json({
          success: false,

          message:
            "Agent action not found",
        });
      }

      if (
        action.status !==
        "pending"
      ) {
        return res.status(400).json({
          success: false,

          message:
            `Action cannot be approved from ${action.status} state`,
        });
      }

      const previousStatus =
        action.status;

      action.status =
        "approved";

      action.approvedAt =
        new Date();

      appendAuditEvent(
        action,
        {
          event:
            "approved",

          fromStatus:
            previousStatus,

          toStatus:
            "approved",

          actor:
            "merchant",

          reason:
            "Merchant approved the agent action.",

          metadata: {
            merchantId:
              String(
                req.merchantId
              ),

            actionType:
              action.type,

            financialAction:
              action.financialAction,

            estimatedImpact:
              action.estimatedImpact,
          },
        }
      );

      await action.save();

      return res.status(200).json({
        success: true,

        message:
          "Agent action approved",

        data: {
          action,
        },
      });
    } catch (error) {
      console.error(
        "Approve action error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to approve action",

        error:
          error.message,
      });
    }
  };

// =========================================================
// REJECT
// =========================================================

const rejectAction =
  async (req, res) => {
    try {
      const action =
        await AgentAction.findOne({
          _id:
            req.params.id,

          merchant:
            req.merchantId,
        });

      if (!action) {
        return res.status(404).json({
          success: false,

          message:
            "Agent action not found",
        });
      }

      if (
        action.status !==
        "pending"
      ) {
        return res.status(400).json({
          success: false,

          message:
            `Action cannot be rejected from ${action.status} state`,
        });
      }

      const previousStatus =
        action.status;

      const rejectionReason =
        req.body?.reason ||
        "Rejected by merchant";

      action.status =
        "rejected";

      action.rejectedAt =
        new Date();

      action.rejectionReason =
        rejectionReason;

      appendAuditEvent(
        action,
        {
          event:
            "rejected",

          fromStatus:
            previousStatus,

          toStatus:
            "rejected",

          actor:
            "merchant",

          reason:
            rejectionReason,

          metadata: {
            merchantId:
              String(
                req.merchantId
              ),

            actionType:
              action.type,
          },
        }
      );

      await action.save();

      return res.status(200).json({
        success: true,

        message:
          "Agent action rejected",

        data: {
          action,
        },
      });
    } catch (error) {
      console.error(
        "Reject action error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to reject action",

        error:
          error.message,
      });
    }
  };

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  createActionsFromAnalysis,
  getPendingActions,
  getActionHistory,
  approveAction,
  rejectAction,
};