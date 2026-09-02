const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    customerInfo: {
      name: {
        type: String,
        trim: true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        trim: true,
      },
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one product",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      amount: {
        type: Number,
        default: 0,
        min: 0,
      },

      code: {
        type: String,
        default: null,
        trim: true,
        uppercase: true,
      },
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    payment: {
      razorpayOrderId: {
        type: String,
        default: null,
        index: true,
      },

      razorpayPaymentId: {
        type: String,
        default: null,
      },

      razorpaySignature: {
        type: String,
        default: null,
      },

      method: {
        type: String,
        enum: [
          "upi",
          "card",
          "netbanking",
          "wallet",
          "emi",
          "unknown",
        ],
        default: "unknown",
      },

      status: {
        type: String,
        enum: [
          "created",
          "attempted",
          "paid",
          "failed",
          "refunded",
          "partially_refunded",
        ],
        default: "created",
        index: true,
      },

      failureReason: {
        type: String,
        default: null,
      },

      paidAt: {
        type: Date,
        default: null,
      },
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    source: {
      type: String,
      enum: [
        "website",
        "ai_buyer",
        "merchant_agent",
        "mobile",
        "api",
      ],
      default: "website",
      index: true,
    },

    attribution: {
      campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      campaignName: {
        type: String,
        default: null,
      },

      agentGenerated: {
        type: Boolean,
        default: false,
      },
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({
  merchant: 1,
  createdAt: -1,
});

orderSchema.index({
  merchant: 1,
  "payment.status": 1,
});

orderSchema.index({
  merchant: 1,
  source: 1,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;