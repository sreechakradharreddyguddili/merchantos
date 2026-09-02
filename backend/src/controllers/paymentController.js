const Order = require("../models/Order");

const {
  createRazorpayOrder,
  verifyPaymentSignature,
} = require("../services/razorpayService");

const createPaymentOrder = async (req, res) => {
  try {
    const merchantId = req.merchantId;

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      merchant: merchantId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order has already been paid",
      });
    }

    const razorpayOrder =
      await createRazorpayOrder({
        amount: order.totalAmount,
        currency: order.currency,
        receipt: order.orderNumber,
        notes: {
          merchantId: merchantId.toString(),
          orderId: order._id.toString(),
        },
      });

    order.payment.razorpayOrderId =
      razorpayOrder.id;

    order.payment.status = "attempted";

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Razorpay order created",

      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        merchantKeyId:
          process.env.RAZORPAY_KEY_ID,
        orderId: order._id,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error(
      "Create Razorpay order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const merchantId = req.merchantId;

    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (
      !orderId ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      merchant: merchantId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.payment.razorpayOrderId !==
      razorpayOrderId
    ) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID mismatch",
      });
    }

    const isValid = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    order.payment.razorpayPaymentId =
      razorpayPaymentId;

    order.payment.razorpaySignature =
      razorpaySignature;

    order.payment.status = "paid";

    order.payment.paidAt = new Date();

    order.orderStatus = "confirmed";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",

      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.payment.status,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    console.error(
      "Verify payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};