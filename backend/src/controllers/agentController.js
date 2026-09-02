const {
  analyzeMerchantGrowth,
  checkAIServiceHealth,
} = require("../services/aiService");

const GrowthAnalysis = require(
  "../models/GrowthAnalysis"
);


const analyzeGrowth = async (req, res) => {
  try {
    const merchantId = req.merchantId;

    const result =
      await analyzeMerchantGrowth(
        merchantId
      );

    const data = result.data || {};

    const overview =
      data.overview || {};

    const diagnosis =
      data.diagnosis || {};

    const recommendations =
      data.recommendations || [];

    const aiAnalysis =
      data.ai_analysis || "";

    const businessHealth =
      diagnosis.business_health ||
      "healthy";

    let totalEstimatedImpact = 0;

    if (
      diagnosis.issues &&
      Array.isArray(diagnosis.issues)
    ) {
      for (
        const issue of diagnosis.issues
      ) {
        totalEstimatedImpact +=
          Number(
            issue.estimated_loss || 0
          );

        totalEstimatedImpact +=
          Number(
            issue
              .estimated_revenue_opportunity ||
              0
          );
      }
    }

    if (
      Array.isArray(recommendations)
    ) {
      for (
        const recommendation of
          recommendations
      ) {
        totalEstimatedImpact +=
          Number(
            recommendation
              .estimated_impact || 0
          );
      }
    }

    const analysis =
      await GrowthAnalysis.create({
        merchant: merchantId,

        businessHealth,

        overview: {
          revenue:
            overview.revenue || 0,

          totalOrders:
            overview.total_orders || 0,

          paidOrders:
            overview.paid_orders || 0,

          failedPayments:
            overview.failed_payments || 0,

          averageOrderValue:
            overview.average_order_value ||
            0,

          paymentSuccessRate:
            overview.payment_success_rate ||
            0,
        },

        diagnosis,

        recommendations,

        aiAnalysis,

        totalEstimatedImpact:
          Math.round(
            totalEstimatedImpact * 100
          ) / 100,

        analysisType: "manual",
      });

    return res.status(200).json({
      success: true,

      agent:
        "MerchantOS Growth Agent",

      data: {
        ...data,

        analysisId:
          analysis._id,

        savedAt:
          analysis.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "AI growth analysis error:",
      error.response?.data ||
        error.message
    );

    return res.status(503).json({
      success: false,

      message:
        "AI Growth Agent is currently unavailable",
    });
  }
};


const getAgentHealth = async (
  req,
  res
) => {
  try {
    const result =
      await checkAIServiceHealth();

    return res.status(200).json({
      success: true,

      aiService: result,
    });
  } catch (error) {
    return res.status(503).json({
      success: false,

      message:
        "AI service unavailable",
    });
  }
};


module.exports = {
  analyzeGrowth,
  getAgentHealth,
};