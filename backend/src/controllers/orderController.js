const crypto = require("crypto");

const Order = require("../models/Order");
const Product = require("../models/Product");

const generateOrderNumber = () => {
  const timestamp = Date.now();

  const random = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();

  return `MOS-${timestamp}-${random}`;
};

/*
 * CREATE ORDER
 */
const createOrder = async (req, res) => {
  try {
    const merchantId = req.merchantId;

    const {
      items,
      customerInfo,
      shippingFee = 0,
      tax = 0,
      discountAmount = 0,
      discountCode = null,
      source = "website",
      currency = "INR",
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required",
      });
    }

    const productIds = items.map(
      (item) => item.product
    );

    const products = await Product.find({
      _id: { $in: productIds },
      merchant: merchantId,
      isActive: true,
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products are invalid",
      });
    }

    const productMap = new Map(
      products.map((product) => [
        product._id.toString(),
        product,
      ])
    );

    const orderItems = [];

    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(
        item.product.toString()
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.name}`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const totalPrice =
        product.price * quantity;

      subtotal += totalPrice;

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        quantity,
        unitPrice: product.price,
        totalPrice,
      });
    }

    const discount = Math.max(
      0,
      Number(discountAmount) || 0
    );

    const taxAmount = Math.max(
      0,
      Number(tax) || 0
    );

    const shippingAmount = Math.max(
      0,
      Number(shippingFee) || 0
    );

    if (discount > subtotal) {
      return res.status(400).json({
        success: false,
        message: "Discount cannot exceed subtotal",
      });
    }

    const totalAmount =
      subtotal -
      discount +
      taxAmount +
      shippingAmount;

    const order = await Order.create({
      merchant: merchantId,

      orderNumber:
        generateOrderNumber(),

      customerInfo: customerInfo || {},

      items: orderItems,

      subtotal,

      discount: {
        amount: discount,
        code: discountCode,
      },

      tax: taxAmount,

      shippingFee: shippingAmount,

      totalAmount,

      currency,

      source,

      payment: {
        status: "created",
      },
    });

    return res.status(201).json({
      success: true,

      message:
        `Order ${order.orderNumber} created successfully`,

      data: {
        order,
      },
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

/*
 * GET ORDERS
 */
const getOrders = async (req, res) => {
  try {
    const merchantId = req.merchantId;

    const {
      status,
      paymentStatus,
      source,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {
      merchant: merchantId,
    };

    /*
     * ORDER STATUS FILTER
     */
    if (status) {
      query.orderStatus = status;
    }

    /*
     * PAYMENT STATUS FILTER
     */
    if (paymentStatus) {
      query["payment.status"] =
        paymentStatus;
    }

    /*
     * SOURCE FILTER
     */
    if (source) {
      query.source = source;
    }

    /*
     * SEARCH
     *
     * Search by:
     * - order number
     * - customer name
     * - customer email
     * - customer phone
     */
    if (search && search.trim()) {
      const searchRegex =
        new RegExp(
          search.trim(),
          "i"
        );

      query.$or = [
        {
          orderNumber:
            searchRegex,
        },
        {
          "customerInfo.name":
            searchRegex,
        },
        {
          "customerInfo.email":
            searchRegex,
        },
        {
          "customerInfo.phone":
            searchRegex,
        },
      ];
    }

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    /*
     * IMPORTANT:
     *
     * Do NOT populate "customer".
     *
     * There is currently no Customer model
     * registered in Mongoose.
     *
     * Customer information is stored directly
     * inside customerInfo.
     */
    const [orders, total] =
      await Promise.all([
        Order.find(query)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limitNumber),

        Order.countDocuments(query),
      ]);

    return res.status(200).json({
      success: true,

      data: {
        orders,

        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,

          totalPages:
            Math.ceil(
              total / limitNumber
            ),
        },
      },
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch orders",
    });
  }
};

/*
 * GET SINGLE ORDER
 */
const getOrderById = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findOne({
        _id: req.params.id,
        merchant: req.merchantId,
      }).populate(
        "items.product",
        "name category price sku"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,

      data: {
        order,
      },
    });
  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order",
    });
  }
};

/*
 * UPDATE PAYMENT STATUS
 */
const updatePaymentStatus = async (
  req,
  res
) => {
  try {
    const {
      status,
      method,
      razorpayPaymentId,
      failureReason,
    } = req.body;

    const allowedStatuses = [
      "attempted",
      "paid",
      "failed",
      "refunded",
      "partially_refunded",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment status",
      });
    }

    const order =
      await Order.findOne({
        _id: req.params.id,
        merchant: req.merchantId,
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const previousStatus =
      order.payment.status;

    order.payment.status =
      status;

    if (method) {
      order.payment.method =
        method;
    }

    if (razorpayPaymentId) {
      order.payment.razorpayPaymentId =
        razorpayPaymentId;
    }

    if (failureReason) {
      order.payment.failureReason =
        failureReason;
    }

    if (status === "paid") {
      order.payment.paidAt =
        new Date();

      order.orderStatus =
        "confirmed";
    }

    if (status === "failed") {
      order.orderStatus =
        "pending";
    }

    await order.save();

    /*
     * Update inventory and analytics
     * only when payment becomes paid.
     */
    if (
      previousStatus !== "paid" &&
      status === "paid"
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
        "Payment status updated",

      data: {
        order,
      },
    });
  } catch (error) {
    console.error(
      "Update payment status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update payment status",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updatePaymentStatus,
};