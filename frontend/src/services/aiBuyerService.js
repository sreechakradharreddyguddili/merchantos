import api from "./api";

/**
 * Get AI Buyer recommendations
 */
export const recommendAIBuyerProducts = async ({
  merchantId,
  message,
  history = [],
}) => {
  if (!merchantId) {
    throw new Error("Merchant ID is required");
  }

  if (!message?.trim()) {
    throw new Error("Buyer message is required");
  }

  return api.post("/ai-buyer/recommend", {
    merchantId,
    message: message.trim(),
    history: Array.isArray(history)
      ? history
      : [],
  });
};

/**
 * Get AI Buyer catalog
 */
export const getAIBuyerCatalog = async (
  merchantId
) => {
  if (!merchantId) {
    throw new Error(
      "Merchant ID is required"
    );
  }

  return api.get(
    `/ai-buyer/catalog?merchantId=${encodeURIComponent(
      merchantId
    )}`
  );
};

/**
 * Create AI Buyer order
 */
export const createAIBuyerOrder = async (
  orderData
) => {
  if (!orderData?.merchantId) {
    throw new Error(
      "Merchant ID is required"
    );
  }

  if (!orderData?.productId) {
    throw new Error(
      "Product ID is required"
    );
  }

  return api.post("/ai-buyer/order", {
    merchantId:
      orderData.merchantId,

    productId:
      orderData.productId,

    quantity:
      orderData.quantity || 1,

    customerInfo:
      orderData.customerInfo || {},
  });
};

/**
 * Create Razorpay payment order
 */
export const createAIBuyerPayment =
  async (paymentData) => {
    if (!paymentData?.merchantId) {
      throw new Error(
        "Merchant ID is required"
      );
    }

    if (!paymentData?.orderId) {
      throw new Error(
        "Order ID is required"
      );
    }

    return api.post(
      "/ai-buyer/payment",
      {
        merchantId:
          paymentData.merchantId,

        orderId:
          paymentData.orderId,
      }
    );
  };

/**
 * Verify Razorpay payment
 */
export const verifyAIBuyerPayment =
  async (paymentData) => {
    if (!paymentData?.merchantId) {
      throw new Error(
        "Merchant ID is required"
      );
    }

    if (!paymentData?.orderId) {
      throw new Error(
        "Order ID is required"
      );
    }

    if (
      !paymentData?.razorpayOrderId
    ) {
      throw new Error(
        "Razorpay order ID is required"
      );
    }

    if (
      !paymentData?.razorpayPaymentId
    ) {
      throw new Error(
        "Razorpay payment ID is required"
      );
    }

    if (
      !paymentData?.razorpaySignature
    ) {
      throw new Error(
        "Razorpay signature is required"
      );
    }

    return api.post(
      "/ai-buyer/verify",
      {
        merchantId:
          paymentData.merchantId,

        orderId:
          paymentData.orderId,

        razorpayOrderId:
          paymentData.razorpayOrderId,

        razorpayPaymentId:
          paymentData.razorpayPaymentId,

        razorpaySignature:
          paymentData.razorpaySignature,
      }
    );
  };