const mongoose = require("mongoose");

const Product = require("../models/Product");
const Order = require("../models/Order");
const Merchant = require("../models/Merchant");

const {
  createRazorpayOrder,
  verifyPaymentSignature,
} = require("../services/razorpayService");

const {
  recommendBuyerProducts,
} = require("../services/aiBuyerService");

// =====================================================
// AI BUYER RECOMMENDATIONS
// =====================================================

const recommendAIBuyerProducts = async (req, res) => {
  try {
    const {
      merchantId,
      message,
      history = [],
    } = req.body;

    if (!merchantId) {
      return res.status(400).json({
        success: false,
        message: "Merchant ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(merchantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid merchant ID",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Buyer message is required",
      });
    }

    const merchant = await Merchant.findOne({
      _id: merchantId,
      isActive: true,
    }).select("_id businessName currency");

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    const result = await recommendBuyerProducts({
      merchantId,
      message: message.trim(),
      history: Array.isArray(history)
        ? history
        : [],
    });

    return res.status(200).json({
      success: true,
      agent: "MerchantOS AI Buyer",
      data: result,
    });
  } catch (error) {
    console.error(
      "AI Buyer recommendation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI buyer recommendations",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// =====================================================
// GET AI BUYER CATALOG
// =====================================================

const getAIBuyerCatalog = async (
  req,
  res
) => {
  try {
    const merchantId =
      req.query.merchantId;

    if (!merchantId) {
      return res.status(400).json({
        success: false,
        message:
          "Merchant ID is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        merchantId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid merchant ID",
      });
    }

    const merchant =
      await Merchant.findOne({
        _id: merchantId,
        isActive: true,
      }).select(
        "businessName currency"
      );

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message:
          "Merchant not found",
      });
    }

    const products =
      await Product.find({
        merchant: merchantId,

        isActive: true,

        stock: {
          $gt: 0,
        },

        "aiMetadata.aiSearchEnabled":
          true,
      })
        .select(
          [
            "name",
            "description",
            "category",
            "price",
            "compareAtPrice",
            "currency",
            "stock",
            "sku",
            "images",
            "features",
            "tags",
            "specifications",
            "aiMetadata",
          ].join(" ")
        )
        .lean();

    const catalog =
      products.map(
        (product) => ({
          id:
            product._id,

          name:
            product.name,

          description:
            product.description,

          category:
            product.category,

          price:
            product.price,

          compareAtPrice:
            product.compareAtPrice,

          currency:
            product.currency ||
            merchant.currency ||
            "INR",

          stock:
            product.stock,

          available:
            product.stock >
            0,

          sku:
            product.sku,

          images:
            product.images ||
            [],

          features:
            product.features ||
            [],

          tags:
            product.tags ||
            [],

          specifications:
            product.specifications ||
            {},

          targetAudience:
            product.aiMetadata
              ?.targetAudience ||
            [],

          useCases:
            product.aiMetadata
              ?.useCases ||
            [],

          compatibleWith:
            product.aiMetadata
              ?.compatibleWith ||
            [],

          sellingPoints:
            product.aiMetadata
              ?.sellingPoints ||
            [],
        })
      );

    return res.status(200).json({
      success: true,

      agent:
        "MerchantOS AI Buyer",

      data: {
        merchantId,

        merchantName:
          merchant.businessName,

        currency:
          merchant.currency ||
          "INR",

        catalogVersion:
          "1.0",

        totalProducts:
          catalog.length,

        products:
          catalog,

        generatedAt:
          new Date(),
      },
    });
  } catch (error) {
    console.error(
      "AI Buyer catalog error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load AI buyer catalog",
    });
  }
};

// =====================================================
// CREATE AI BUYER ORDER
// =====================================================

const createAIBuyerOrder =
  async (req, res) => {
    try {
      const {
        merchantId,
        productId,
        quantity = 1,
        customerInfo = {},
      } = req.body;

      if (!merchantId) {
        return res.status(400).json({
          success: false,
          message:
            "Merchant ID is required",
        });
      }

      if (!productId) {
        return res.status(400).json({
          success: false,
          message:
            "Product ID is required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          merchantId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid merchant ID",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          productId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid product ID",
        });
      }

      const normalizedQuantity =
        Number(quantity);

      if (
        !Number.isInteger(
          normalizedQuantity
        ) ||
        normalizedQuantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Quantity must be a positive integer",
        });
      }

      const merchant =
        await Merchant.findOne({
          _id: merchantId,
          isActive: true,
        }).select(
          "businessName currency"
        );

      if (!merchant) {
        return res.status(404).json({
          success: false,
          message:
            "Merchant not found",
        });
      }

      const product =
        await Product.findOne({
          _id: productId,

          merchant:
            merchantId,

          isActive:
            true,

          "aiMetadata.aiSearchEnabled":
            true,
        });

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "AI buyer product not found",
        });
      }

      if (
        product.stock <
        normalizedQuantity
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Insufficient stock for ${product.name}`,
        });
      }

      const totalPrice =
        product.price *
        normalizedQuantity;

      const safeCustomerInfo = {
        name:
          customerInfo?.name ||
          "AI Buyer",

        email:
          customerInfo?.email ||
          "ai-buyer@merchantos.local",

        phone:
          customerInfo?.phone ||
          undefined,
      };

      const order =
        await Order.create({
          merchant:
            merchantId,

          orderNumber:
            generateOrderNumber(),

          customerInfo:
            safeCustomerInfo,

          items: [
            {
              product:
                product._id,

              name:
                product.name,

              sku:
                product.sku,

              quantity:
                normalizedQuantity,

              unitPrice:
                product.price,

              totalPrice,
            },
          ],

          subtotal:
            totalPrice,

          discount: {
            amount:
              0,

            code:
              null,
          },

          tax:
            0,

          shippingFee:
            0,

          totalAmount:
            totalPrice,

          currency:
            product.currency ||
            merchant.currency ||
            "INR",

          source:
            "ai_buyer",

          attribution: {
            agentGenerated:
              true,
          },

          metadata: {
            buyerType:
              "ai",

            createdBy:
              "merchantos_ai_buyer",

            productId:
              product._id.toString(),

            productName:
              product.name,
          },

          payment: {
            status:
              "created",
          },

          orderStatus:
            "pending",
        });

      return res.status(201).json({
        success: true,

        message:
          "AI buyer order created",

        data: {
          order,
        },
      });
    } catch (error) {
      console.error(
        "Create AI buyer order error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create AI buyer order",
      });
    }
  };

// =====================================================
// CREATE RAZORPAY ORDER FOR AI BUYER
// =====================================================

const createAIBuyerPayment =
  async (req, res) => {
    try {
      const {
        merchantId,
        orderId,
      } = req.body;

      if (!merchantId) {
        return res.status(400).json({
          success: false,
          message:
            "Merchant ID is required",
        });
      }

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message:
            "Order ID is required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          merchantId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid merchant ID",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          orderId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order ID",
        });
      }

      const order =
        await Order.findOne({
          _id:
            orderId,

          merchant:
            merchantId,

          source:
            "ai_buyer",
        });

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "AI buyer order not found",
        });
      }

      if (
        order.payment.status ===
        "paid"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Order has already been paid",
        });
      }

      const razorpayOrder =
        await createRazorpayOrder({
          amount:
            order.totalAmount,

          currency:
            order.currency,

          receipt:
            order.orderNumber,

          notes: {
            merchantId:
              merchantId.toString(),

            orderId:
              order._id.toString(),

            source:
              "ai_buyer",
          },
        });

      order.payment
        .razorpayOrderId =
        razorpayOrder.id;

      order.payment.status =
        "attempted";

      await order.save();

      return res.status(201).json({
        success: true,

        message:
          "Razorpay test order created",

        data: {
          razorpayOrderId:
            razorpayOrder.id,

          amount:
            razorpayOrder.amount,

          currency:
            razorpayOrder.currency,

          merchantKeyId:
            process.env
              .RAZORPAY_KEY_ID,

          orderId:
            order._id,

          orderNumber:
            order.orderNumber,

          source:
            "ai_buyer",
        },
      });
    } catch (error) {
      console.error(
        "Create AI buyer Razorpay order error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create AI buyer Razorpay order",
      });
    }
  };

// =====================================================
// VERIFY AI BUYER PAYMENT
// =====================================================

const verifyAIBuyerPayment =
  async (req, res) => {
    try {
      const {
        merchantId,
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      } = req.body;

      if (
        !merchantId ||
        !orderId ||
        !razorpayOrderId ||
        !razorpayPaymentId ||
        !razorpaySignature
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment verification data is incomplete",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          merchantId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid merchant ID",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          orderId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order ID",
        });
      }

      const order =
        await Order.findOne({
          _id:
            orderId,

          merchant:
            merchantId,

          source:
            "ai_buyer",
        });

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "AI buyer order not found",
        });
      }

      if (
        order.payment
          .razorpayOrderId !==
        razorpayOrderId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Razorpay order ID mismatch",
        });
      }

      const isValid =
        verifyPaymentSignature({
          razorpayOrderId,

          razorpayPaymentId,

          razorpaySignature,
        });

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment signature",
        });
      }

      const previousStatus =
        order.payment.status;

      order.payment
        .razorpayPaymentId =
        razorpayPaymentId;

      order.payment
        .razorpaySignature =
        razorpaySignature;

      order.payment.status =
        "paid";

      order.payment.paidAt =
        new Date();

      order.orderStatus =
        "confirmed";

      order.attribution =
        order.attribution ||
        {};

      order.attribution
        .agentGenerated =
        true;

      order.metadata =
        order.metadata ||
        {};

      order.metadata.paymentFlow =
        "ai_buyer_razorpay";

      await order.save();

      // =================================================
      // UPDATE PRODUCT ANALYTICS + STOCK ONCE
      // =================================================

      if (
        previousStatus !==
          "paid" &&
        order.payment.status ===
          "paid"
      ) {
        await Promise.all(
          order.items.map(
            async (item) => {
              await Product.findByIdAndUpdate(
                item.product,
                {
                  $inc: {
                    stock:
                      -item.quantity,

                    "analytics.purchases":
                      item.quantity,

                    "analytics.revenue":
                      item.totalPrice,
                  },
                }
              );
            }
          )
        );
      }

      return res.status(200).json({
        success: true,

        message:
          "AI buyer payment verified successfully",

        data: {
          orderId:
            order._id,

          orderNumber:
            order.orderNumber,

          paymentStatus:
            order.payment
              .status,

          orderStatus:
            order.orderStatus,

          source:
            order.source,

          agentGenerated:
            order.attribution
              ?.agentGenerated ||
            false,
        },
      });
    } catch (error) {
      console.error(
        "Verify AI buyer payment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to verify AI buyer payment",
      });
    }
  };

// =====================================================
// ORDER NUMBER
// =====================================================

const generateOrderNumber =
  () => {
    const timestamp =
      Date.now();

    const random =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `MOS-AI-${timestamp}-${random}`;
  };

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  recommendAIBuyerProducts,
  getAIBuyerCatalog,
  createAIBuyerOrder,
  createAIBuyerPayment,
  verifyAIBuyerPayment,
};