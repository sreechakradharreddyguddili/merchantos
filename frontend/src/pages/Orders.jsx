import { useEffect, useMemo, useState } from "react";

import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";

import {
  getOrders,
  createOrder,
  updatePaymentStatus,
} from "../services/orderService";

import {
  getProducts,
} from "../services/productService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCreateOrder, setShowCreateOrder] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [quantity, setQuantity] = useState(1);

  const [customerName, setCustomerName] =
    useState("");

  const [customerEmail, setCustomerEmail] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("upi");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        ordersResponse,
        productsResponse,
      ] = await Promise.all([
        getOrders({
          limit: 100,
        }),

        getProducts({
          limit: 100,
        }),
      ]);

      setOrders(
        ordersResponse?.data?.orders || []
      );

      setProducts(
        productsResponse?.data?.products || []
      );
    } catch (err) {
      console.error(
        "Orders loading error:",
        err
      );

      setError(
        err?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product?.isActive !== false &&
        Number(product?.stock || 0) > 0
    );
  }, [products]);

  const selectedProductData =
    products.find(
      (product) =>
        String(product?._id) ===
        String(selectedProduct)
    );

  const orderPreviewTotal =
    selectedProductData
      ? Number(
          selectedProductData.price || 0
        ) *
        Math.max(
          Number(quantity) || 1,
          1
        )
      : 0;

  const resetOrderForm = () => {
    setSelectedProduct("");
    setQuantity(1);
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setPaymentMethod("upi");
  };

  const handleCreateOrder =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!selectedProduct) {
        setError(
          "Please select a product."
        );
        return;
      }

      const product =
        selectedProductData;

      if (!product) {
        setError(
          "Selected product was not found."
        );
        return;
      }

      const requestedQuantity =
        Number(quantity);

      if (
        !Number.isInteger(
          requestedQuantity
        ) ||
        requestedQuantity <= 0
      ) {
        setError(
          "Quantity must be a positive whole number."
        );
        return;
      }

      if (
        requestedQuantity >
        Number(product.stock || 0)
      ) {
        setError(
          `Only ${product.stock} units of ${product.name} are available.`
        );
        return;
      }

      try {
        setSaving(true);

        const response =
          await createOrder({
            items: [
              {
                product:
                  product._id,
                quantity:
                  requestedQuantity,
              },
            ],

            customerInfo: {
              name:
                customerName.trim() ||
                undefined,

              email:
                customerEmail.trim() ||
                undefined,

              phone:
                customerPhone.trim() ||
                undefined,
            },

            shippingFee: 0,
            tax: 0,
            discountAmount: 0,
            discountCode: null,

            source: "website",
          });

        if (!response?.success) {
          setError(
            response?.message ||
              "Failed to create order."
          );
          return;
        }

        const createdOrder =
          response?.data?.order;

        setSuccess(
          createdOrder?.orderNumber
            ? `Order ${createdOrder.orderNumber} created successfully.`
            : "Order created successfully."
        );

        setShowCreateOrder(false);

        resetOrderForm();

        await loadData();
      } catch (err) {
        console.error(
          "Create order error:",
          err
        );

        setError(
          err?.message ||
            "Failed to create order."
        );
      } finally {
        setSaving(false);
      }
    };

  const handleMarkPaid =
    async (order) => {
      setError("");
      setSuccess("");

      if (!order?._id) {
        return;
      }

      try {
        setSaving(true);

        const response =
          await updatePaymentStatus(
            order._id,
            {
              status: "paid",
              method:
                paymentMethodForOrder(
                  order
                ),
            }
          );

        if (!response?.success) {
          setError(
            response?.message ||
              "Failed to update payment."
          );
          return;
        }

        setSuccess(
          `${order.orderNumber} marked as paid successfully.`
        );

        await loadData();
      } catch (err) {
        console.error(
          "Payment update error:",
          err
        );

        setError(
          err?.message ||
            "Failed to update payment."
        );
      } finally {
        setSaving(false);
      }
    };

  const paymentMethodForOrder =
    (order) => {
      if (
        order?.payment?.method &&
        order.payment.method !==
          "unknown"
      ) {
        return order.payment.method;
      }

      return "upi";
    };

  const formatCurrency =
    (amount, currency = "INR") => {
      try {
        return new Intl.NumberFormat(
          "en-IN",
          {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
          }
        ).format(
          Number(amount || 0)
        );
      } catch {
        return `${currency} ${Number(
          amount || 0
        ).toFixed(2)}`;
      }
    };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getPaymentStatusClass =
    (status) => {
      switch (status) {
        case "paid":
          return "status-completed";

        case "failed":
          return "status-rejected";

        case "attempted":
          return "status-pending";

        default:
          return "status-pending";
      }
    };

  const getOrderStatusClass =
    (status) => {
      switch (status) {
        case "delivered":
        case "confirmed":
          return "status-completed";

        case "cancelled":
        case "refunded":
          return "status-rejected";

        default:
          return "status-pending";
      }
    };

  if (loading) {
    return (
      <div className="page module-page">
        <div className="page-heading">
          <span className="eyebrow">
            MERCHANT COMMAND CENTER
          </span>

          <h1>
            Orders
          </h1>

          <p>
            Manage customer orders,
            payments and order activity.
          </p>
        </div>

        <div className="page-card">
          <Loading
            message="Loading orders..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page module-page">

      <div className="page-heading">

        <div>
          <span className="eyebrow">
            MERCHANT COMMAND CENTER
          </span>

          <h1>
            Orders
          </h1>

          <p>
            Create and manage real
            customer orders.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setError("");
            setSuccess("");
            setShowCreateOrder(true);
          }}
        >
          + Create Order
        </Button>

      </div>

      <Alert
        type="error"
        message={error}
        onClose={() =>
          setError("")
        }
      />

      <Alert
        type="success"
        message={success}
        onClose={() =>
          setSuccess("")
        }
      />

      {showCreateOrder && (
        <div className="page-card">

          <div className="page-heading">
            <div>
              <span className="section-label">
                NEW ORDER
              </span>

              <h2>
                Create Customer Order
              </h2>

              <p>
                Select one of your existing
                products and create a real
                order.
              </p>
            </div>
          </div>

          <form
            className="order-form"
            onSubmit={
              handleCreateOrder
            }
          >

            <div className="form-grid">

              <div className="form-group product-select-group">

                <label>
                  Product
                </label>

                <select
                  value={
                    selectedProduct
                  }
                  onChange={(event) =>
                    setSelectedProduct(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select a product
                  </option>

                  {availableProducts.map(
                    (product) => (
                      <option
                        key={
                          product._id
                        }
                        value={
                          product._id
                        }
                      >
                        {product.name} —{" "}
                        {formatCurrency(
                          product.price,
                          product.currency ||
                            "INR"
                        )}{" "}
                        — Stock:{" "}
                        {product.stock}
                      </option>
                    )
                  )}
                </select>

              </div>

              <div className="form-group">

                <label>
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  max={
                    selectedProductData
                      ?.stock || 1
                  }
                  value={
                    quantity
                  }
                  onChange={(
                    event
                  ) =>
                    setQuantity(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Customer Name
                </label>

                <input
                  type="text"
                  value={
                    customerName
                  }
                  onChange={(
                    event
                  ) =>
                    setCustomerName(
                      event.target.value
                    )
                  }
                  placeholder="John Smith"
                />

              </div>

              <div className="form-group">

                <label>
                  Customer Email
                </label>

                <input
                  type="email"
                  value={
                    customerEmail
                  }
                  onChange={(
                    event
                  ) =>
                    setCustomerEmail(
                      event.target.value
                    )
                  }
                  placeholder="john@example.com"
                />

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Customer Phone
                </label>

                <input
                  type="text"
                  value={
                    customerPhone
                  }
                  onChange={(
                    event
                  ) =>
                    setCustomerPhone(
                      event.target.value
                    )
                  }
                  placeholder="+91 9876543210"
                />

              </div>

              <div className="form-group">

                <label>
                  Payment Method
                </label>

                <select
                  value={
                    paymentMethod
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                >
                  <option value="upi">
                    UPI
                  </option>

                  <option value="card">
                    Card
                  </option>

                  <option value="netbanking">
                    Net Banking
                  </option>

                  <option value="wallet">
                    Wallet
                  </option>

                  <option value="emi">
                    EMI
                  </option>
                </select>

              </div>

            </div>

            {selectedProductData && (
            <div className="order-summary">

                <div className="order-summary-header">
                <div>
                    <span className="order-summary-label">
                    SELECTED PRODUCT
                    </span>

                    <h3>
                    {selectedProductData.name}
                    </h3>
                </div>

                <span className="order-summary-stock">
                    {selectedProductData.stock} in stock
                </span>
                </div>

                <div className="order-summary-grid">

                <div className="order-summary-item">
                    <span>
                    Unit Price
                    </span>

                    <strong>
                    {formatCurrency(
                        selectedProductData.price,
                        selectedProductData.currency ||
                        "INR"
                    )}
                    </strong>
                </div>

                <div className="order-summary-item">
                    <span>
                    Quantity
                    </span>

                    <strong>
                    {quantity}
                    </strong>
                </div>

                <div className="order-summary-item">
                    <span>
                    Subtotal
                    </span>

                    <strong>
                    {formatCurrency(
                        orderPreviewTotal,
                        selectedProductData.currency ||
                        "INR"
                    )}
                    </strong>
                </div>

                </div>

                <div className="order-summary-total">
                <span>
                    ORDER TOTAL
                </span>

                <strong>
                    {formatCurrency(
                    orderPreviewTotal,
                    selectedProductData.currency ||
                        "INR"
                    )}
                </strong>
                </div>

            </div>
            )}

            <div className="form-actions">

              <Button
                type="submit"
                loading={saving}
                disabled={
                  saving ||
                  !selectedProduct
                }
              >
                Create Order
              </Button>

              <button
                type="button"
                className="button"
                disabled={saving}
                onClick={() => {
                  setShowCreateOrder(
                    false
                  );
                  resetOrderForm();
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      <div className="page-card">

        <div className="page-heading">

          <div>
            <span className="section-label">
              ORDER HISTORY
            </span>

            <h2>
              {orders.length} Orders
            </h2>

            <p>
              All orders created for
              your business.
            </p>
          </div>

        </div>

        {orders.length === 0 ? (
          <div className="empty-state">

            <h3>
              No orders yet
            </h3>

            <p>
              Create your first order
              using the button above.
            </p>

          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >

            <table className="data-table">

              <thead>

                <tr>

                  <th>
                    Order
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Product
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Order Status
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.map(
                  (order) => {

                    const firstItem =
                      order?.items?.[0];

                    return (
                      <tr
                        key={
                          order._id
                        }
                      >

                        <td>
                          <strong>
                            {
                              order.orderNumber
                            }
                          </strong>
                        </td>

                        <td>

                          <div>
                            {
                              order
                                ?.customerInfo
                                ?.name ||
                              "Guest Customer"
                            }
                          </div>

                          <small>
                            {
                              order
                                ?.customerInfo
                                ?.email ||
                              order
                                ?.customerInfo
                                ?.phone ||
                              "-"
                            }
                          </small>

                        </td>

                        <td>

                          <div>
                            {
                              firstItem
                                ?.name ||
                              "Product"
                            }
                          </div>

                          <small>
                            Qty:{" "}
                            {
                              firstItem
                                ?.quantity ||
                              0
                            }
                          </small>

                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              order.totalAmount,
                              order.currency ||
                                "INR"
                            )}
                          </strong>
                        </td>

                        <td>
                          <PaymentStatus
                            status={
                              order?.payment?.status ||
                              "created"
                            }
                          />
                        </td>

                        <td>

                          <span
                            className={`status-badge ${getOrderStatusClass(
                              order
                                ?.orderStatus
                            )}`}
                          >
                            {
                              order
                                ?.orderStatus ||
                              "pending"
                            }
                          </span>

                        </td>

                        <td>
                          {formatDate(
                            order.createdAt
                          )}
                        </td>

                        <td>

                          {order
                            ?.payment
                            ?.status !==
                            "paid" && (
                            <button
                              type="button"
                              className="button button-primary"
                              disabled={
                                saving
                              }
                              onClick={() =>
                                handleMarkPaid(
                                  order
                                )
                              }
                            >
                              Mark Paid
                            </button>
                          )}

                          {order
                            ?.payment
                            ?.status ===
                            "paid" && (
                            <span className="paid-indicator">
                              <span className="paid-check">
                                ✓
                              </span>

                              <span>
                                Paid
                              </span>
                            </span>
                          )}

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}
function PaymentStatus({
  status,
}) {
  const normalizedStatus =
    String(
      status || "created"
    ).toLowerCase();

  if (
    normalizedStatus ===
    "paid"
  ) {
    return (
      <span className="paid-indicator">
        <span className="paid-check">
          ✓
        </span>

        <span>
          Paid
        </span>
      </span>
    );
  }

  if (
    normalizedStatus ===
      "created" ||
    normalizedStatus ===
      "attempted" ||
    normalizedStatus ===
      "pending" ||
    normalizedStatus ===
      "hold"
  ) {
    return (
      <span className="hold-indicator">
        <span className="hold-icon">
          ◷
        </span>

        <span>
          On Hold
        </span>
      </span>
    );
  }

  if (
    normalizedStatus ===
    "failed"
  ) {
    return (
      <span className="failed-indicator">
        <span className="failed-icon">
          !
        </span>

        <span>
          Failed
        </span>
      </span>
    );
  }

  return (
    <span className="hold-indicator">
      <span className="hold-icon">
        ◷
      </span>

      <span>
        On Hold
      </span>
    </span>
  );
}

export default Orders;