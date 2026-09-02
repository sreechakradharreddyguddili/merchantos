const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:8000";

const recommendBuyerProducts = async ({
  merchantId,
  message,
  history = [],
}) => {
  if (!merchantId) {
    throw new Error("Merchant ID is required");
  }

  if (!message || !message.trim()) {
    throw new Error("Buyer message is required");
  }

  const response = await axios.post(
    `${AI_SERVICE_URL}/api/agent/buyer/recommend`,
    {
      merchant_id: merchantId,
      message: message.trim(),
      history,
    },
    {
      timeout: 30000,
    }
  );

  return response.data;
};

module.exports = {
  recommendBuyerProducts,
};