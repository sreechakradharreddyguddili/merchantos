const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const createRazorpayOrder = async ({
  amount,
  currency = "INR",
  receipt,
  notes = {},
}) => {
  if (!amount || amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt,
    notes,
  });

  return order;
};

const verifyPaymentSignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpayOrderId}|${razorpayPaymentId}`
    )
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(razorpaySignature)
  );
};

const verifyWebhookSignature = ({
  rawBody,
  signature,
}) => {
  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_WEBHOOK_SECRET
    )
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
};