const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    segment: {
      type: String,
      enum: [
        "new",
        "returning",
        "high_value",
        "at_risk",
        "inactive",
      ],
      default: "new",
      index: true,
    },

    analytics: {
      totalOrders: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalSpent: {
        type: Number,
        default: 0,
        min: 0,
      },

      averageOrderValue: {
        type: Number,
        default: 0,
        min: 0,
      },

      successfulPayments: {
        type: Number,
        default: 0,
        min: 0,
      },

      failedPayments: {
        type: Number,
        default: 0,
        min: 0,
      },

      lastPurchaseAt: {
        type: Date,
        default: null,
      },
    },

    preferences: {
      categories: [
        {
          type: String,
          trim: true,
        },
      ],

      products: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
    },

    aiProfile: {
      interests: [
        {
          type: String,
          trim: true,
        },
      ],

      likelyNextPurchase: {
        type: String,
        default: null,
      },

      churnRisk: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
      },

      lifetimeValue: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index(
  {
    merchant: 1,
    email: 1,
  },
  {
    unique: true,
  }
);

customerSchema.index({
  merchant: 1,
  "analytics.totalSpent": -1,
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;