const GrowthAnalysis = require(
  "../models/GrowthAnalysis"
);


const getAnalysisHistory = async (
  req,
  res
) => {
  try {
    const merchantId =
      req.merchantId;

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 10,
        1
      ),
      50
    );

    const analyses =
      await GrowthAnalysis.find({
        merchant: merchantId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(limit)
        .select(
          [
            "businessHealth",
            "overview",
            "diagnosis",
            "recommendations",
            "aiAnalysis",
            "totalEstimatedImpact",
            "analysisType",
            "createdAt",
          ].join(" ")
        );

    return res.status(200).json({
      success: true,

      data: {
        analyses,
      },
    });
  } catch (error) {
    console.error(
      "Analysis history error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch analysis history",
    });
  }
};


const getLatestAnalysis = async (
  req,
  res
) => {
  try {
    const analysis =
      await GrowthAnalysis.findOne({
        merchant:
          req.merchantId,
      }).sort({
        createdAt: -1,
      });

    if (!analysis) {
      return res.status(404).json({
        success: false,

        message:
          "No growth analysis found",
      });
    }

    return res.status(200).json({
      success: true,

      data: {
        analysis,
      },
    });
  } catch (error) {
    console.error(
      "Latest analysis error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch latest analysis",
    });
  }
};


module.exports = {
  getAnalysisHistory,
  getLatestAnalysis,
};