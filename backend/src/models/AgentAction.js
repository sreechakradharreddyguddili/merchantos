const mongoose = require("mongoose");

/*
 * =========================================================
 * AUDIT EVENT SCHEMA
 * =========================================================
 *
 * Each important agent lifecycle transition is recorded:
 *
 * recommendation_created
 * approved
 * rejected
 * execution_started
 * completed
 * failed
 * cancelled
 *
 * This gives MerchantOS a visible audit trail without
 * storing hidden chain-of-thought.
 */

const auditEventSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      enum: [
        "recommendation_created",
        "approved",
        "rejected",
        "execution_started",
        "completed",
        "failed",
        "cancelled",
      ],
      required: true,
    },

    fromStatus: {
      type: String,
      default: null,
    },

    toStatus: {
      type: String,
      default: null,
    },

    actor: {
      type: String,
      enum: [
        "ai_agent",
        "merchant",
        "system",
      ],
      required: true,
    },

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    _id: false,
  }
);

/*
 * =========================================================
 * AGENT ACTION SCHEMA
 * =========================================================
 */

const agentActionSchema = new mongoose.Schema(
  {
    /* =====================================================
       MERCHANT
       ===================================================== */

    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },

    /* =====================================================
       SOURCE GROWTH ANALYSIS
       ===================================================== */

    analysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GrowthAnalysis",
      default: null,
    },

    /* =====================================================
       ACTION TYPE
       ===================================================== */

    type: {
      type: String,
      enum: [
        "payment_recovery",
        "conversion_experiment",
        "cross_sell",
        "inventory_replenishment",
        "campaign",
        "ai_buyer_growth",
      ],
      required: true,
    },

    /* =====================================================
       ACTION CONTENT
       ===================================================== */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    /* =====================================================
       PRIORITY
       ===================================================== */

    priority: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
      ],
      default: "MEDIUM",
    },

    /* =====================================================
       IMPACT / POLICY
       ===================================================== */

    estimatedImpact: {
      type: Number,
      default: 0,
    },

    financialAction: {
      type: Boolean,
      default: false,
    },

    requiresApproval: {
      type: Boolean,
      default: true,
    },

    /* =====================================================
       POLICY DECISION SNAPSHOT
       ===================================================== */

    policyDecision: {
      risk: {
        type: String,
        default: "LOW",
      },

      reason: {
        type: String,
        default: "",
      },

      evaluatedAt: {
        type: Date,
        default: null,
      },
    },

    /* =====================================================
       DECISION EVIDENCE
       ===================================================== */

    decisionEvidence: {
      trigger: {
        type: String,
        default: "",
      },

      evidence: {
        type: [String],
        default: [],
      },

      recommendationId: {
        type: String,
        default: "",
      },

      sourceChannel: {
        type: String,
        default: "growth_agent",
      },

      expectedOutcome: {
        type: String,
        default: "",
      },

      estimatedImpact: {
        type: Number,
        default: 0,
      },

      recordedAt: {
        type: Date,
        default: Date.now,
      },
    },

    /* =====================================================
       CROSS-SELL DETAILS
       ===================================================== */

    crossSellDetails: {
      primaryProduct: {
        type: String,
        default: "",
      },

      complementaryProduct: {
        type: String,
        default: "",
      },

      reasons: {
        type: [String],
        default: [],
      },
    },

    /* =====================================================
       STATUS
       ===================================================== */

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "executing",
        "completed",
        "failed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    /* =====================================================
       LIFECYCLE TIMESTAMPS
       ===================================================== */

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    executedAt: {
      type: Date,
      default: null,
    },

    /* =====================================================
       REJECTION
       ===================================================== */

    rejectionReason: {
      type: String,
      default: "",
    },

    /* =====================================================
       EXECUTION
       ===================================================== */

    executionResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    /* =====================================================
       AUDIT TRAIL
       ===================================================== */

    auditTrail: {
      type: [auditEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/*
 * =========================================================
 * INDEXES
 * =========================================================
 */

agentActionSchema.index({
  merchant: 1,
  status: 1,
  createdAt: -1,
});

agentActionSchema.index({
  merchant: 1,
  type: 1,
  status: 1,
});

agentActionSchema.index({
  "auditTrail.timestamp": -1,
});

/*
 * =========================================================
 * MODEL
 * =========================================================
 */

const AgentAction = mongoose.model(
  "AgentAction",
  agentActionSchema
);

module.exports = AgentAction;