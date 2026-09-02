import api from "./api";

const getOrders = async (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.append(
          key,
          value
        );
      }
    }
  );

  const query =
    searchParams.toString();

  return api.get(
    `/orders${query ? `?${query}` : ""}`
  );
};

const createOrder = async (
  orderData
) => {
  return api.post(
    "/orders",
    orderData
  );
};

const getOrderById = async (
  orderId
) => {
  return api.get(
    `/orders/${orderId}`
  );
};

const updatePaymentStatus = async (
  orderId,
  paymentData
) => {
  return api.patch(
    `/orders/${orderId}/payment`,
    paymentData
  );
};

export {
  getOrders,
  createOrder,
  getOrderById,
  updatePaymentStatus,
};

export default {
  getOrders,
  createOrder,
  getOrderById,
  updatePaymentStatus,
};