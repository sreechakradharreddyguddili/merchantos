const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    businessType: {
      type: String,
      enum: [
        "ecommerce",
        "saas",
        "services",
        "education",
        "healthcare",
        "other",
      ],
      default: "ecommerce",
    },

    currency: {
      type: String,
      default: "INR",
    },

    razorpay: {
      keyId: {
        type: String,
        default: null,
      },

      keySecret: {
        type: String,
        default: null,
        select: false,
      },

      accountConnected: {
        type: Boolean,
        default: false,
      },
    },

    growthSettings: {
      maxDiscountPercentage: {
        type: Number,
        default: 10,
        min: 0,
        max: 100,
      },

      maxCampaignBudget: {
        type: Number,
        default: 5000,
        min: 0,
      },

      requireApprovalForFinancialActions: {
        type: Boolean,
        default: true,
      },

      allowAutomaticCampaigns: {
        type: Boolean,
        default: false,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastAgentAnalysis: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Merchant = mongoose.model(
  "Merchant",
  merchantSchema
);

module.exports = Merchant;