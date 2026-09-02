const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: 5000,
    },

    /*
     * Category is intentionally a String instead of an enum.
     *
     * The frontend can provide common categories in a dropdown,
     * but merchants can also type a custom category if they
     * cannot find what they need.
     */
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      maxlength: 100,
      index: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    /*
     * Supported major currencies.
     *
     * INR remains the default.
     */
    currency: {
      type: String,
      enum: [
        "INR", // Indian Rupee
        "USD", // US Dollar
        "GBP", // British Pound
        "EUR", // Euro
        "JPY", // Japanese Yen
        "CAD", // Canadian Dollar
        "AUD", // Australian Dollar
        "CHF", // Swiss Franc
        "SGD", // Singapore Dollar
        "AED", // UAE Dirham
        "SAR", // Saudi Riyal
        "KRW", // South Korean Won
        "CNY", // Chinese Yuan
        "NZD", // New Zealand Dollar
        "ZAR", // South African Rand
      ],
      default: "INR",
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
      uppercase: true,
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /*
     * AI-related product information.
     */
    aiMetadata: {
      searchableText: {
        type: String,
        default: "",
      },

      targetAudience: [
        {
          type: String,
          trim: true,
        },
      ],

      useCases: [
        {
          type: String,
          trim: true,
        },
      ],

      compatibleWith: [
        {
          type: String,
          trim: true,
        },
      ],

      sellingPoints: [
        {
          type: String,
          trim: true,
        },
      ],

      aiSearchEnabled: {
        type: Boolean,
        default: true,
      },
    },

    /*
     * Product-level analytics.
     */
    analytics: {
      views: {
        type: Number,
        default: 0,
        min: 0,
      },

      cartAdds: {
        type: Number,
        default: 0,
        min: 0,
      },

      purchases: {
        type: Number,
        default: 0,
        min: 0,
      },

      revenue: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    /*
     * Soft delete.
     */
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Product SKU lookup for each merchant.
 */
productSchema.index({
  merchant: 1,
  sku: 1,
});

/*
 * Category filtering for each merchant.
 */
productSchema.index({
  merchant: 1,
  category: 1,
  isActive: 1,
});

/*
 * Product search.
 */
productSchema.index({
  merchant: 1,
  name: "text",
  description: "text",
  tags: "text",
});

const Product = mongoose.model(
  "Product",
  productSchema
);

module.exports = Product;