import { useEffect, useMemo, useState } from "react";

import Loading from "../components/common/Loading";
import EmptyState from "../components/common/EmptyState";
import Alert from "../components/common/Alert";

import api from "../services/api";

import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatStatus,
} from "../utils/formatters";

function Analytics() {
  const [overview, setOverview] =
    useState(null);

  const [revenueTrend, setRevenueTrend] =
    useState([]);

  const [
    productPerformance,
    setProductPerformance,
  ] = useState([]);

  const [
    paymentAnalytics,
    setPaymentAnalytics,
  ] = useState(null);

  const [products, setProducts] =
    useState([]);

  const [
    aiBuyerAnalytics,
    setAIBuyerAnalytics,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [days, setDays] =
    useState(30);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  const [
    showRevenueDetails,
    setShowRevenueDetails,
  ] = useState(false);

  /* =========================================================
     LOAD ANALYTICS
     ========================================================= */

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        overviewResponse,
        trendResponse,
        productResponse,
        paymentResponse,
        productsResponse,
        aiBuyerResponse,
      ] = await Promise.all([
        api.get(
          "/analytics/overview"
        ),

        api.get(
          `/analytics/revenue-trend?days=${days}`
        ),

        api.get(
          "/analytics/product-performance"
        ),

        api.get(
          "/analytics/payment-analytics"
        ),

        api.get(
          "/products?limit=100"
        ),

        api.get(
          "/analytics/ai-buyer"
        ),
      ]);

      setOverview(
        overviewResponse?.data || null
      );

      setRevenueTrend(
        trendResponse?.data?.trend ||
          []
      );

      setProductPerformance(
        productResponse?.data?.products ||
          []
      );

      setPaymentAnalytics(
        paymentResponse?.data || null
      );

      setProducts(
        productsResponse?.data?.products ||
          []
      );

      setAIBuyerAnalytics(
        aiBuyerResponse?.data || null
      );
    } catch (err) {
      console.error(
        "Analytics loading error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     REFRESH
     ========================================================= */

  const refreshAnalytics = async () => {
    try {
      setRefreshing(true);
      setError("");

      const [
        overviewResponse,
        trendResponse,
        productResponse,
        paymentResponse,
        productsResponse,
        aiBuyerResponse,
      ] = await Promise.all([
        api.get(
          "/analytics/overview"
        ),

        api.get(
          `/analytics/revenue-trend?days=${days}`
        ),

        api.get(
          "/analytics/product-performance"
        ),

        api.get(
          "/analytics/payment-analytics"
        ),

        api.get(
          "/products?limit=100"
        ),

        api.get(
          "/analytics/ai-buyer"
        ),
      ]);

      setOverview(
        overviewResponse?.data || null
      );

      setRevenueTrend(
        trendResponse?.data?.trend ||
          []
      );

      setProductPerformance(
        productResponse?.data
          ?.products || []
      );

      setPaymentAnalytics(
        paymentResponse?.data || null
      );

      setProducts(
        productsResponse?.data
          ?.products || []
      );

      setAIBuyerAnalytics(
        aiBuyerResponse?.data || null
      );
    } catch (err) {
      console.error(
        "Analytics refresh error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to refresh analytics."
      );
    } finally {
      setRefreshing(false);
    }
  };

  /* =========================================================
     PAYMENT SUMMARY
     ========================================================= */

  const paymentSummary =
    useMemo(() => {
      const statuses =
        paymentAnalytics
          ?.paymentStatus || [];

      return statuses.map(
        (item) => ({
          status:
            item?._id ||
            "unknown",

          count: Number(
            item?.count || 0
          ),

          amount: Number(
            item?.amount || 0
          ),
        })
      );
    }, [
      paymentAnalytics,
    ]);

  const failureReasons =
    paymentAnalytics
      ?.failureReasons || [];

  /* =========================================================
     PRODUCT HELPERS
     ========================================================= */

  const getPerformanceProductId =
    (product) => {
      return (
        product?.productId ||
        product?.product?._id ||
        product?.product ||
        product?._id ||
        null
      );
    };

  const getDetailedProduct =
    (performanceProduct) => {
      if (!performanceProduct) {
        return null;
      }

      const performanceId =
        getPerformanceProductId(
          performanceProduct
        );

      const matchingProduct =
        products.find(
          (product) =>
            performanceId &&
            String(
              product?._id
            ) ===
              String(
                performanceId
              )
        );

      return {
        ...(matchingProduct || {}),

        performance:
          performanceProduct,
      };
    };

  const handleProductClick =
    (product) => {
      setSelectedProduct(
        getDetailedProduct(product)
      );
    };

  const getProductRevenue =
    (product) => {
      return Number(
        product?.performance
          ?.revenue ||
          product?.revenue ||
          0
      );
    };

  const getProductUnits =
    (product) => {
      return Number(
        product?.performance
          ?.unitsSold ||
          product?.unitsSold ||
          0
      );
    };

  const getProductOrders =
    (product) => {
      return Number(
        product?.performance
          ?.orders ||
          product?.orders ||
          0
      );
    };

  const formatProductPrice =
    (product) => {
      return formatCurrency(
        product?.price || 0,
        product?.currency || "INR"
      );
    };

  /* =========================================================
     AI BUYER VALUES
     ========================================================= */

  const aiBuyerOrders =
    Number(
      aiBuyerAnalytics
        ?.paidAIBuyerOrders ||
        0
    );

  const aiBuyerTotalOrders =
    Number(
      aiBuyerAnalytics
        ?.totalAIBuyerOrders ||
        0
    );

  const aiBuyerRevenue =
    Number(
      aiBuyerAnalytics
        ?.aiBuyerRevenue ||
        0
    );

  const aiBuyerAOV =
    Number(
      aiBuyerAnalytics
        ?.aiBuyerAOV ||
        0
    );

  const aiBuyerPaymentSuccess =
    Number(
      aiBuyerAnalytics
        ?.aiBuyerPaymentSuccessRate ||
        0
    );

  const aiBuyerRevenueShare =
    Number(
      aiBuyerAnalytics
        ?.aiBuyerRevenueShare ||
        0
    );

  const aiBuyerOrderShare =
    Number(
      aiBuyerAnalytics
        ?.aiBuyerOrderShare ||
        0
    );

  const aiBuyerFailedOrders =
    Number(
      aiBuyerAnalytics
        ?.failedAIBuyerOrders ||
        0
    );

  const topAIBuyerProducts =
    Array.isArray(
      aiBuyerAnalytics
        ?.topAIBuyerProducts
    )
      ? aiBuyerAnalytics
          .topAIBuyerProducts
      : [];

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="page module-page">
        <div className="page-heading">
          <span className="eyebrow">
            MERCHANT COMMAND CENTER
          </span>

          <h1>
            Analytics
          </h1>

          <p>
            Understand your commerce
            performance and trends.
          </p>
        </div>

        <div className="page-card">
          <Loading
            message="Loading analytics..."
          />
        </div>
      </div>
    );
  }

  /* =========================================================
     EMPTY
     ========================================================= */

  if (!overview) {
    return (
      <div className="page module-page">
        <div className="page-heading">
          <span className="eyebrow">
            MERCHANT COMMAND CENTER
          </span>

          <h1>
            Analytics
          </h1>

          <p>
            Understand your commerce
            performance and trends.
          </p>
        </div>

        {error && (
          <Alert
            type="warning"
            message={error}
            onClose={() =>
              setError("")
            }
          />
        )}

        <div className="page-card">
          <EmptyState
            title="No analytics available"
            message="Commerce analytics will appear once your store has order data."
          />
        </div>
      </div>
    );
  }

  /* =========================================================
     OVERVIEW VALUES
     ========================================================= */

  const revenue =
    Number(
      overview?.revenue || 0
    );

  const totalOrders =
    Number(
      overview?.totalOrders || 0
    );

  const paidOrders =
    Number(
      overview?.paidOrders || 0
    );

  const averageOrderValue =
    Number(
      overview?.averageOrderValue ||
        0
    );

  const paymentSuccessRate =
    Number(
      overview?.paymentSuccessRate ||
        0
    );

  const failedPayments =
    Number(
      overview?.failedPayments || 0
    );

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="page module-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="analytics-page-header">
        <div>
          <span className="eyebrow">
            MERCHANT COMMAND CENTER
          </span>

          <h1>
            Analytics
          </h1>

          <p>
            Understand your commerce
            performance and trends.
          </p>
        </div>

        <button
          type="button"
          className="button button-secondary"
          onClick={
            refreshAnalytics
          }
          disabled={refreshing}
        >
          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {error && (
        <Alert
          type="warning"
          message={error}
          onClose={() =>
            setError("")
          }
        />
      )}

      {/* =====================================================
          REVENUE HERO
          ===================================================== */}

      <button
        type="button"
        className="analytics-revenue-card"
        onClick={() =>
          setShowRevenueDetails(
            true
          )
        }
      >
        <div className="analytics-revenue-left">
          <span className="section-label">
            TOTAL REVENUE
          </span>

          <h2>
            {formatCurrency(
              revenue
            )}
          </h2>

          <p>
            Revenue generated from
            recorded commerce activity.
          </p>
        </div>

        <div className="analytics-revenue-right">
          <div className="analytics-revenue-stat">
            <span>
              PAID ORDERS
            </span>

            <strong>
              {formatNumber(
                paidOrders
              )}
            </strong>
          </div>

          <div className="analytics-revenue-stat">
            <span>
              AVERAGE ORDER
            </span>

            <strong>
              {formatCurrency(
                averageOrderValue
              )}
            </strong>
          </div>

          <div className="analytics-revenue-arrow">
            →
          </div>
        </div>
      </button>

      {/* =====================================================
          MAIN KPI CARDS
          ===================================================== */}

      <div className="dashboard-metrics analytics-kpis">
        <StatCard
          label="TOTAL ORDERS"
          value={formatNumber(
            totalOrders
          )}
          icon="◎"
        />

        <StatCard
          label="PAID ORDERS"
          value={formatNumber(
            paidOrders
          )}
          icon="✓"
        />

        <StatCard
          label="FAILED PAYMENTS"
          value={formatNumber(
            failedPayments
          )}
          icon="×"
        />

        <StatCard
          label="AVG. ORDER VALUE"
          value={formatCurrency(
            averageOrderValue
          )}
          icon="◈"
        />

        <StatCard
          label="PAYMENT SUCCESS"
          value={formatPercentage(
            paymentSuccessRate
          )}
          icon="%"
        />
      </div>

      {/* =====================================================
          AI BUYER PERFORMANCE
          ===================================================== */}

      <section className="page-card ai-buyer-analytics-card">
        <div className="card-header">
          <div>
            <span className="section-label">
              AI COMMERCE
            </span>

            <h2>
              AI Buyer Performance
            </h2>

            <p className="analytics-card-description">
              Revenue and order activity
              generated through the AI
              Buyer channel.
            </p>
          </div>

          <div className="ai-buyer-analytics-badge">
            AI BUYER
          </div>
        </div>

        <div className="dashboard-metrics ai-buyer-analytics-metrics">
          <StatCard
            label="AI BUYER ORDERS"
            value={formatNumber(
              aiBuyerOrders
            )}
            icon="AI"
          />

          <StatCard
            label="AI BUYER REVENUE"
            value={formatCurrency(
              aiBuyerRevenue
            )}
            icon="₹"
          />

          <StatCard
            label="AI BUYER AOV"
            value={formatCurrency(
              aiBuyerAOV
            )}
            icon="◈"
          />

          <StatCard
            label="AI PAYMENT SUCCESS"
            value={formatPercentage(
              aiBuyerPaymentSuccess
            )}
            icon="%"
          />
        </div>

        <div className="analytics-two-column ai-buyer-analytics-details">
          <div className="analytics-health-list">
            <HealthRow
              label="Total AI Buyer Orders"
              value={formatNumber(
                aiBuyerTotalOrders
              )}
            />

            <HealthRow
              label="Paid AI Buyer Orders"
              value={formatNumber(
                aiBuyerOrders
              )}
            />

            <HealthRow
              label="Failed AI Buyer Orders"
              value={formatNumber(
                aiBuyerFailedOrders
              )}
            />

            <HealthRow
              label="Revenue Contribution"
              value={formatPercentage(
                aiBuyerRevenueShare
              )}
            />

            <HealthRow
              label="Order Contribution"
              value={formatPercentage(
                aiBuyerOrderShare
              )}
            />
          </div>

          <div>
            <div className="card-header">
              <div>
                <span className="section-label">
                  PRODUCTS
                </span>

                <h2>
                  Top AI Buyer Products
                </h2>
              </div>
            </div>

            {topAIBuyerProducts
              .length === 0 ? (
              <div className="ai-buyer-analytics-empty">
                <strong>
                  No AI Buyer sales yet
                </strong>

                <p>
                  Products purchased through
                  AI Buyer will appear here.
                </p>
              </div>
            ) : (
              <div className="ai-buyer-top-products">
                {topAIBuyerProducts
                  .slice(0, 5)
                  .map(
                    (
                      product,
                      index
                    ) => (
                      <div
                        className="ai-buyer-top-product"
                        key={
                          product?._id ||
                          index
                        }
                      >
                        <div className="ai-buyer-top-product-rank">
                          {index + 1}
                        </div>

                        <div className="ai-buyer-top-product-info">
                          <strong>
                            {product?.productName ||
                              "Unnamed Product"}
                          </strong>

                          <span>
                            {formatNumber(
                              product?.unitsSold ||
                                0
                            )}{" "}
                            units ·{" "}
                            {formatNumber(
                              product?.orders ||
                                0
                            )}{" "}
                            orders
                          </span>
                        </div>

                        <strong>
                          {formatCurrency(
                            product?.revenue ||
                              0
                          )}
                        </strong>
                      </div>
                    )
                  )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          REVENUE TREND
          ===================================================== */}

      <div className="page-card analytics-trend-card">
        <div className="card-header">
          <div>
            <span className="section-label">
              PERFORMANCE
            </span>

            <h2>
              Revenue Trend
            </h2>

            <p className="analytics-card-description">
              Revenue recorded over
              the selected period.
            </p>
          </div>

          <select
            className="form-input analytics-period-select"
            value={days}
            onChange={(event) =>
              setDays(
                Number(
                  event.target.value
                )
              )
            }
          >
            <option value={7}>
              Last 7 days
            </option>

            <option value={30}>
              Last 30 days
            </option>

            <option value={60}>
              Last 60 days
            </option>

            <option value={90}>
              Last 90 days
            </option>
          </select>
        </div>

        {revenueTrend.length ===
        0 ? (
          <EmptyState
            title="No revenue trend yet"
            message="Paid order activity will appear here."
          />
        ) : (
          <RevenueTrend
            data={
              revenueTrend
            }
          />
        )}
      </div>

      {/* =====================================================
          PRODUCTS
          ===================================================== */}

      <div className="page-card">
        <div className="card-header">
          <div>
            <span className="section-label">
              PRODUCTS
            </span>

            <h2>
              Top Performing Products
            </h2>

            <p className="analytics-card-description">
              Select a product to
              view complete performance.
            </p>
          </div>
        </div>

        {productPerformance.length ===
        0 ? (
          <EmptyState
            title="No product sales yet"
            message="Product performance will appear after paid orders are recorded."
          />
        ) : (
          <div className="analytics-product-grid">
            {productPerformance
              .slice(0, 10)
              .map(
                (
                  product,
                  index
                ) => {
                  const revenueValue =
                    getProductRevenue(
                      product
                    );

                  const unitsValue =
                    getProductUnits(
                      product
                    );

                  const ordersValue =
                    getProductOrders(
                      product
                    );

                  return (
                    <button
                      type="button"
                      className="analytics-product-card"
                      key={
                        getPerformanceProductId(
                          product
                        ) ||
                        index
                      }
                      onClick={() =>
                        handleProductClick(
                          product
                        )
                      }
                    >
                      <div className="analytics-product-top">
                        <div className="analytics-product-icon">
                          {index + 1}
                        </div>

                        <span className="analytics-product-open">
                          View →
                        </span>
                      </div>

                      <div className="analytics-product-name">
                        {product?.productName ||
                          "Unnamed Product"}
                      </div>

                      <div className="analytics-product-metrics">
                        <div>
                          <span>
                            UNITS
                          </span>

                          <strong>
                            {formatNumber(
                              unitsValue
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            ORDERS
                          </span>

                          <strong>
                            {formatNumber(
                              ordersValue
                            )}
                          </strong>
                        </div>
                      </div>

                      <div className="analytics-product-revenue">
                        <span>
                          REVENUE
                        </span>

                        <strong>
                          {formatCurrency(
                            revenueValue
                          )}
                        </strong>
                      </div>
                    </button>
                  );
                }
              )}
          </div>
        )}
      </div>

      {/* =====================================================
          PAYMENTS
          ===================================================== */}

      <div className="analytics-two-column">
        <div className="page-card">
          <div className="card-header">
            <div>
              <span className="section-label">
                PAYMENTS
              </span>

              <h2>
                Payment Performance
              </h2>
            </div>
          </div>

          {paymentSummary.length ===
          0 ? (
            <EmptyState
              title="No payment data"
              message="Payment performance will appear here."
            />
          ) : (
            <div className="analytics-payment-list">
              {paymentSummary.map(
                (item) => (
                  <div
                    className="analytics-payment-row"
                    key={
                      item.status
                    }
                  >
                    <div className="analytics-payment-main">
                      <div
                        className={`analytics-payment-icon ${getPaymentClass(
                          item.status
                        )}`}
                      >
                        {getPaymentIcon(
                          item.status
                        )}
                      </div>

                      <div>
                        <strong>
                          {formatStatus(
                            item.status
                          )}
                        </strong>

                        <span>
                          {formatNumber(
                            item.count
                          )}{" "}
                          transactions
                        </span>
                      </div>
                    </div>

                    <strong>
                      {formatCurrency(
                        item.amount
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="page-card">
          <div className="card-header">
            <div>
              <span className="section-label">
                BUSINESS SNAPSHOT
              </span>

              <h2>
                Commerce Health
              </h2>
            </div>
          </div>

          <div className="analytics-health-list">
            <HealthRow
              label="Revenue"
              value={formatCurrency(
                revenue
              )}
            />

            <HealthRow
              label="Orders"
              value={formatNumber(
                totalOrders
              )}
            />

            <HealthRow
              label="Paid Orders"
              value={formatNumber(
                paidOrders
              )}
            />

            <HealthRow
              label="Average Order Value"
              value={formatCurrency(
                averageOrderValue
              )}
            />

            <HealthRow
              label="Payment Success"
              value={formatPercentage(
                paymentSuccessRate
              )}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          FAILURE REASONS
          ===================================================== */}

      {failureReasons.length >
        0 && (
        <div className="page-card">
          <div className="card-header">
            <div>
              <span className="section-label">
                PAYMENT ISSUES
              </span>

              <h2>
                Failure Reasons
              </h2>
            </div>
          </div>

          <div className="analytics-list">
            {failureReasons.map(
              (
                item,
                index
              ) => (
                <div
                  className="analytics-list-item"
                  key={
                    item?._id ||
                    index
                  }
                >
                  <div>
                    <strong>
                      {item?._id ||
                        "Unknown reason"}
                    </strong>

                    <span>
                      {formatNumber(
                        item?.count
                      )}{" "}
                      failures
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          PRODUCT DETAILS MODAL
          ===================================================== */}

      {selectedProduct && (
        <div
          className="analytics-modal-overlay"
          onClick={() =>
            setSelectedProduct(
              null
            )
          }
        >
          <div
            className="analytics-modal"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <div className="analytics-modal-header">
              <div>
                <span className="section-label">
                  PRODUCT PERFORMANCE
                </span>

                <h2>
                  {selectedProduct.name ||
                    selectedProduct
                      ?.performance
                      ?.productName ||
                    "Product Details"}
                </h2>
              </div>

              <button
                type="button"
                className="analytics-modal-close"
                onClick={() =>
                  setSelectedProduct(
                    null
                  )
                }
              >
                ×
              </button>
            </div>

            <div className="analytics-detail-grid">
              <DetailItem
                label="SKU"
                value={
                  selectedProduct.sku ||
                  "—"
                }
              />

              <DetailItem
                label="CATEGORY"
                value={
                  selectedProduct.category ||
                  "—"
                }
              />

              <DetailItem
                label="PRICE"
                value={
                  selectedProduct.price !==
                  undefined
                    ? formatProductPrice(
                        selectedProduct
                      )
                    : "—"
                }
              />

              <DetailItem
                label="CURRENT STOCK"
                value={
                  selectedProduct.stock !==
                  undefined
                    ? formatNumber(
                        selectedProduct.stock
                      )
                    : "—"
                }
              />

              <DetailItem
                label="UNITS SOLD"
                value={formatNumber(
                  getProductUnits(
                    selectedProduct?.performance
                  )
                )}
              />

              <DetailItem
                label="ORDERS"
                value={formatNumber(
                  getProductOrders(
                    selectedProduct?.performance
                  )
                )}
              />

              <DetailItem
                label="REVENUE"
                value={formatCurrency(
                  getProductRevenue(
                    selectedProduct
                  ),
                  selectedProduct.currency ||
                    "INR"
                )}
              />

              <DetailItem
                label="STATUS"
                value={
                  selectedProduct
                    .isActive ===
                  false
                    ? "Inactive"
                    : "Active"
                }
              />
            </div>

            <div className="analytics-detail-description">
              <span>
                DESCRIPTION
              </span>

              <p>
                {selectedProduct
                  .description ||
                  "No product description available."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          REVENUE DETAILS MODAL
          ===================================================== */}

      {showRevenueDetails && (
        <div
          className="analytics-modal-overlay"
          onClick={() =>
            setShowRevenueDetails(
              false
            )
          }
        >
          <div
            className="analytics-modal revenue-detail-modal"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <div className="analytics-modal-header">
              <div>
                <span className="section-label">
                  REVENUE OVERVIEW
                </span>

                <h2>
                  Commerce Revenue
                </h2>
              </div>

              <button
                type="button"
                className="analytics-modal-close"
                onClick={() =>
                  setShowRevenueDetails(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            <div className="revenue-detail-main">
              <span>
                TOTAL REVENUE
              </span>

              <strong>
                {formatCurrency(
                  revenue
                )}
              </strong>
            </div>

            <div className="analytics-detail-grid">
              <DetailItem
                label="TOTAL ORDERS"
                value={formatNumber(
                  totalOrders
                )}
              />

              <DetailItem
                label="PAID ORDERS"
                value={formatNumber(
                  paidOrders
                )}
              />

              <DetailItem
                label="FAILED PAYMENTS"
                value={formatNumber(
                  failedPayments
                )}
              />

              <DetailItem
                label="AVERAGE ORDER"
                value={formatCurrency(
                  averageOrderValue
                )}
              />

              <DetailItem
                label="PAYMENT SUCCESS"
                value={formatPercentage(
                  paymentSuccessRate
                )}
              />

              <DetailItem
                label="AI BUYER REVENUE"
                value={formatCurrency(
                  aiBuyerRevenue
                )}
              />

              <DetailItem
                label="AI BUYER REVENUE SHARE"
                value={formatPercentage(
                  aiBuyerRevenueShare
                )}
              />

              <DetailItem
                label="PERIOD"
                value={`Last ${days} days`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="dashboard-metric">
      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">
        <span className="metric-label">
          {label}
        </span>

        <strong className="metric-value">
          {value}
        </strong>
      </div>
    </div>
  );
}

/* =========================================================
   HEALTH ROW
   ========================================================= */

function HealthRow({
  label,
  value,
}) {
  return (
    <div className="analytics-health-row">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
   ========================================================= */

function DetailItem({
  label,
  value,
}) {
  return (
    <div className="analytics-detail-item">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   PAYMENT HELPERS
   ========================================================= */

function getPaymentClass(
  status
) {
  switch (status) {
    case "paid":
      return "payment-success";

    case "failed":
      return "payment-failed";

    case "attempted":
      return "payment-warning";

    default:
      return "payment-neutral";
  }
}

function getPaymentIcon(
  status
) {
  switch (status) {
    case "paid":
      return "✓";

    case "failed":
      return "×";

    case "attempted":
      return "◷";

    default:
      return "•";
  }
}

/* =========================================================
   REVENUE TREND
   ========================================================= */

function RevenueTrend({
  data,
}) {
  const maxRevenue =
    Math.max(
      ...data.map(
        (item) =>
          Number(
            item?.revenue || 0
          )
      ),
      1
    );

  return (
    <div className="analytics-chart">
      {data.map(
        (
          item,
          index
        ) => {
          const revenue =
            Number(
              item?.revenue ||
                0
            );

          const percentage =
            revenue === 0
              ? 4
              : Math.max(
                  6,
                  (revenue /
                    maxRevenue) *
                    100
                );

          const date =
            item?._id
              ? `${String(
                  item._id.day
                ).padStart(
                  2,
                  "0"
                )}/${String(
                  item._id.month
                ).padStart(
                  2,
                  "0"
                )}`
              : `Day ${
                  index + 1
                }`;

          return (
            <div
              className="analytics-chart-item"
              key={`${date}-${index}`}
            >
              <span className="analytics-chart-value">
                {formatCurrency(
                  revenue
                )}
              </span>

              <div className="analytics-chart-bar-wrap">
                <div
                  className="analytics-chart-bar"
                  style={{
                    height: `${percentage}%`,
                  }}
                  title={`${date}: ${formatCurrency(
                    revenue
                  )}`}
                />
              </div>

              <span className="analytics-chart-label">
                {date}
              </span>
            </div>
          );
        }
      )}
    </div>
  );
}

export default Analytics;