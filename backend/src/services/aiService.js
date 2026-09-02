const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://127.0.0.1:8000";

const analyzeMerchantGrowth = async (
  merchantId
) => {
  const response = await axios.post(
    `${AI_SERVICE_URL}/api/agent/analyze/${merchantId}`,
    {},
    {
      timeout: 60000,
    }
  );

  return response.data;
};

const checkAIServiceHealth = async () => {
  const response = await axios.get(
    `${AI_SERVICE_URL}/api/health`,
    {
      timeout: 5000,
    }
  );

  return response.data;
};

module.exports = {
  analyzeMerchantGrowth,
  checkAIServiceHealth,
};