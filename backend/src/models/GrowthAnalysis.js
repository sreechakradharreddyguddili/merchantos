const mongoose = require("mongoose");

const growthAnalysisSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },

    businessHealth: {
      type: String,
      enum: [
        "healthy",
        "needs_attention",
        "critical",
      ],
      required: true,
    },

    overview: {
      revenue: {
        type: Number,
        default: 0,
      },

      totalOrders: {
        type: Number,
        default: 0,
      },

      paidOrders: {
        type: Number,
        default: 0,
      },

      failedPayments: {
        type: Number,
        default: 0,
      },

      averageOrderValue: {
        type: Number,
        default: 0,
      },

      paymentSuccessRate: {
        type: Number,
        default: 0,
      },
    },

    diagnosis: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    recommendations: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    aiAnalysis: {
      type: String,
      default: "",
    },

    totalEstimatedImpact: {
      type: Number,
      default: 0,
    },

    analysisType: {
      type: String,
      enum: [
        "manual",
        "scheduled",
        "event_triggered",
      ],
      default: "manual",
    },
  },
  {
    timestamps: true,
  }
);

growthAnalysisSchema.index({
  merchant: 1,
  createdAt: -1,
});

const GrowthAnalysis = mongoose.model(
  "GrowthAnalysis",
  growthAnalysisSchema
);

module.exports = GrowthAnalysis;