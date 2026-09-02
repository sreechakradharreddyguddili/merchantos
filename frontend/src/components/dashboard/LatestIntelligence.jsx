function LatestIntelligence({
  analysis,
  onViewDetails,
}) {
  const metrics =
    analysis?.metrics || {};

  return (
    <section className="page-card">

      <div className="card-header">

        <div>
          <span className="section-label">
            LATEST INTELLIGENCE
          </span>

          <h2>
            AI Growth Analysis
          </h2>
        </div>

        <button
          type="button"
          className="text-button"
          onClick={onViewDetails}
        >
          View Details →
        </button>

      </div>

      <div className="metrics-grid">

        <Metric
          label="REVENUE"
          value={formatCurrency(
            metrics.revenue
          )}
        />

        <Metric
          label="TOTAL ORDERS"
          value={
            metrics.totalOrders ?? 0
          }
        />

        <Metric
          label="PAID ORDERS"
          value={
            metrics.paidOrders ?? 0
          }
        />

        <Metric
          label="FAILED PAYMENTS"
          value={
            metrics.failedPayments ?? 0
          }
        />

        <Metric
          label="AVERAGE ORDER VALUE"
          value={formatCurrency(
            metrics.averageOrderValue
          )}
        />

        <Metric
          label="PAYMENT SUCCESS"
          value={`${Number(
            metrics.paymentSuccessRate || 0
          ).toFixed(1)}%`}
        />

      </div>

    </section>
  );
}

function Metric({
  label,
  value,
}) {
  return (
    <div className="metric-card">

      <span className="metric-label">
        {label}
      </span>

      <strong className="metric-value">
        {value}
      </strong>

    </div>
  );
}

function formatCurrency(value) {
  const number = Number(value || 0);

  return `₹${number.toLocaleString(
    "en-IN"
  )}`;
}

export default LatestIntelligence;