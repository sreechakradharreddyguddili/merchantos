import api from "./api";

export const getLatestGrowthAnalysis =
  async () => {
    return api.get(
      "/growth-analysis/latest"
    );
  };

export const getGrowthAnalysisHistory =
  async () => {
    return api.get(
      "/growth-analysis/history"
    );
  };

export const generateGrowthAnalysis =
  async () => {
    return api.post(
      "/agent/analyze",
      {}
    );
  };