const mongoose = require("mongoose");

const Order = require("../models/Order");

/* =====================================================
   OVERVIEW
   ===================================================== */

const getOverview = async (req, res) => {
  try {
    const merchantId =
      new mongoose.Types.ObjectId(
        req.merchantId
      );

    const [
      revenueResult,
      totalOrders,
      paidOrders,
      failedPayments,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            merchant: merchantId,
            "payment.status": "paid",
          },
        },

        {
          $group: {
            _id: null,

            revenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),

      Order.countDocuments({
        merchant: req.merchantId,
      }),

      Order.countDocuments({
        merchant: req.merchantId,
        "payment.status": "paid",
      }),

      Order.countDocuments({
        merchant: req.merchantId,
        "payment.status": "failed",
      }),
    ]);

    const revenue =
      revenueResult[0]?.revenue || 0;

    const averageOrderValue =
      paidOrders > 0
        ? revenue / paidOrders
        : 0;

    const totalPaymentAttempts =
      paidOrders + failedPayments;

    const paymentSuccessRate =
      totalPaymentAttempts > 0
        ? (paidOrders /
            totalPaymentAttempts) *
          100
        : 0;

    return res.status(200).json({
      success: true,

      data: {
        revenue,
        totalOrders,
        paidOrders,
        failedPayments,
        averageOrderValue,
        paymentSuccessRate,
      },
    });
  } catch (error) {
    console.error(
      "Overview analytics error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to generate overview analytics",
    });
  }
};

/* =====================================================
   REVENUE TREND
   ===================================================== */

const getRevenueTrend = async (
  req,
  res
) => {
  try {
    const days = Math.min(
      Math.max(
        Number(req.query.days) || 30,
        1
      ),
      90
    );

    const startDate = new Date();

    startDate.setDate(
      startDate.getDate() - days
    );

    const trend =
      await Order.aggregate([
        {
          $match: {
            merchant:
              new mongoose.Types.ObjectId(
                req.merchantId
              ),

            "payment.status":
              "paid",

            createdAt: {
              $gte: startDate,
            },
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year:
                  "$createdAt",
              },

              month: {
                $month:
                  "$createdAt",
              },

              day: {
                $dayOfMonth:
                  "$createdAt",
              },
            },

            revenue: {
              $sum: "$totalAmount",
            },

            orders: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
          },
        },
      ]);

    return res.status(200).json({
      success: true,

      data: {
        days,
        trend,
      },
    });
  } catch (error) {
    console.error(
      "Revenue trend error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to generate revenue trend",
    });
  }
};

/* =====================================================
   PRODUCT PERFORMANCE
   ===================================================== */

const getProductPerformance = async (
  req,
  res
) => {
  try {
    const performance =
      await Order.aggregate([
        {
          $match: {
            merchant:
              new mongoose.Types.ObjectId(
                req.merchantId
              ),

            "payment.status":
              "paid",
          },
        },

        {
          $unwind: "$items",
        },

        {
          $group: {
            _id: "$items.product",

            productName: {
              $first:
                "$items.name",
            },

            unitsSold: {
              $sum:
                "$items.quantity",
            },

            revenue: {
              $sum:
                "$items.totalPrice",
            },

            orders: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            revenue: -1,
          },
        },

        {
          $limit: 50,
        },
      ]);

    return res.status(200).json({
      success: true,

      data: {
        products:
          performance,
      },
    });
  } catch (error) {
    console.error(
      "Product performance error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to generate product analytics",
    });
  }
};

/* =====================================================
   PAYMENT ANALYTICS
   ===================================================== */

const getPaymentAnalytics = async (
  req,
  res
) => {
  try {
    const merchantId =
      new mongoose.Types.ObjectId(
        req.merchantId
      );

    const paymentStatus =
      await Order.aggregate([
        {
          $match: {
            merchant:
              merchantId,
          },
        },

        {
          $group: {
            _id:
              "$payment.status",

            count: {
              $sum: 1,
            },

            amount: {
              $sum:
                "$totalAmount",
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },
      ]);

    const failureReasons =
      await Order.aggregate([
        {
          $match: {
            merchant:
              merchantId,

            "payment.status":
              "failed",
          },
        },

        {
          $group: {
            _id:
              "$payment.failureReason",

            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },
      ]);

    return res.status(200).json({
      success: true,

      data: {
        paymentStatus,
        failureReasons,
      },
    });
  } catch (error) {
    console.error(
      "Payment analytics error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to generate payment analytics",
    });
  }
};

/* =====================================================
   AI BUYER ANALYTICS
   ===================================================== */

const getAIBuyerAnalytics = async (
  req,
  res
) => {
  try {
    const merchantId =
      new mongoose.Types.ObjectId(
        req.merchantId
      );

    /* ---------------------------------------------
       ALL AI BUYER ORDERS
       --------------------------------------------- */

    const [
      totalAIBuyerOrders,
      paidAIBuyerOrders,
      failedAIBuyerOrders,
      aiBuyerRevenueResult,
      aiBuyerProductResult,
    ] = await Promise.all([
      Order.countDocuments({
        merchant: merchantId,

        source: "ai_buyer",
      }),

      Order.countDocuments({
        merchant: merchantId,

        source: "ai_buyer",

        "payment.status": "paid",
      }),

      Order.countDocuments({
        merchant: merchantId,

        source: "ai_buyer",

        "payment.status": "failed",
      }),

      Order.aggregate([
        {
          $match: {
            merchant:
              merchantId,

            source: "ai_buyer",

            "payment.status":
              "paid",
          },
        },

        {
          $group: {
            _id: null,

            revenue: {
              $sum:
                "$totalAmount",
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            merchant:
              merchantId,

            source: "ai_buyer",

            "payment.status":
              "paid",
          },
        },

        {
          $unwind: "$items",
        },

        {
          $group: {
            _id:
              "$items.product",

            productName: {
              $first:
                "$items.name",
            },

            unitsSold: {
              $sum:
                "$items.quantity",
            },

            revenue: {
              $sum:
                "$items.totalPrice",
            },

            orders: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            revenue: -1,
          },
        },

        {
          $limit: 20,
        },
      ]),
    ]);

    const aiBuyerRevenue =
      Number(
        aiBuyerRevenueResult[0]
          ?.revenue || 0
      );

    const aiBuyerAOV =
      paidAIBuyerOrders > 0
        ? aiBuyerRevenue /
          paidAIBuyerOrders
        : 0;

    const aiBuyerPaymentAttempts =
      paidAIBuyerOrders +
      failedAIBuyerOrders;

    const aiBuyerPaymentSuccessRate =
      aiBuyerPaymentAttempts >
      0
        ? (paidAIBuyerOrders /
            aiBuyerPaymentAttempts) *
          100
        : 0;

    /* ---------------------------------------------
       TOTAL MERCHANT REVENUE / ORDERS
       --------------------------------------------- */

    const [
      totalRevenueResult,
      totalPaidOrders,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            merchant:
              merchantId,

            "payment.status":
              "paid",
          },
        },

        {
          $group: {
            _id: null,

            revenue: {
              $sum:
                "$totalAmount",
            },
          },
        },
      ]),

      Order.countDocuments({
        merchant: merchantId,

        "payment.status":
          "paid",
      }),
    ]);

    const totalRevenue =
      Number(
        totalRevenueResult[0]
          ?.revenue || 0
      );

    /* ---------------------------------------------
       AI BUYER CONTRIBUTION
       --------------------------------------------- */

    const revenueShare =
      totalRevenue > 0
        ? (aiBuyerRevenue /
            totalRevenue) *
          100
        : 0;

    const orderShare =
      totalPaidOrders > 0
        ? (paidAIBuyerOrders /
            totalPaidOrders) *
          100
        : 0;

    return res.status(200).json({
      success: true,

      data: {
        totalAIBuyerOrders,

        paidAIBuyerOrders,

        failedAIBuyerOrders,

        aiBuyerRevenue,

        aiBuyerAOV,

        aiBuyerPaymentSuccessRate,

        totalMerchantRevenue:
          totalRevenue,

        totalMerchantPaidOrders:
          totalPaidOrders,

        aiBuyerRevenueShare:
          revenueShare,

        aiBuyerOrderShare:
          orderShare,

        topAIBuyerProducts:
          aiBuyerProductResult,
      },
    });
  } catch (error) {
    console.error(
      "AI Buyer analytics error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to generate AI Buyer analytics",
    });
  }
};

/* =====================================================
   EXPORT
   ===================================================== */

module.exports = {
  getOverview,
  getRevenueTrend,
  getProductPerformance,
  getPaymentAnalytics,
  getAIBuyerAnalytics,
};