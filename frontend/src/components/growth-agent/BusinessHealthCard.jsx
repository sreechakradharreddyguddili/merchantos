function BusinessHealthCard({
  health,
  metrics = {},
}) {
  const normalizedHealth = String(
    health || "unknown"
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  const healthLabel = formatLabel(
    normalizedHealth
  );

  return (
    <section className="page-card growth-health-card">
      <div className="growth-health-heading">
        <div>
          <span className="section-label">
            AI ASSESSMENT
          </span>

          <h2>
            Business Health
          </h2>
        </div>

        <span
          className={`growth-health-badge growth-health-${normalizedHealth}`}
        >
          {healthLabel}
        </span>
      </div>

      <div className="growth-health-summary">
        <div
          className={`growth-health-summary-icon growth-health-icon-${normalizedHealth}`}
        >
          {getHealthIcon(
            normalizedHealth
          )}
        </div>

        <div className="growth-health-summary-content">
          <strong>
            {healthLabel}
          </strong>

          <p>
            Latest AI assessment of your
            business performance.
          </p>
        </div>
      </div>

      <div className="growth-health-metrics">

        <Metric
          label="Revenue"
          value={formatCurrency(
            metrics.revenue
          )}
        />

        <Metric
          label="Total Orders"
          value={
            metrics.totalOrders ?? 0
          }
        />

        <Metric
          label="Paid Orders"
          value={
            metrics.paidOrders ?? 0
          }
        />

        <Metric
          label="Failed Payments"
          value={
            metrics.failedPayments ?? 0
          }
        />

        <Metric
          label="Average Order Value"
          value={formatCurrency(
            metrics.averageOrderValue
          )}
        />

        <Metric
          label="Payment Success"
          value={`${Number(
            metrics.paymentSuccessRate ||
              0
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
    <div className="growth-health-metric">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function formatLabel(value) {
  if (!value) {
    return "Unknown";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function formatCurrency(value) {
  const number = Number(
    value || 0
  );

  return `₹${number.toLocaleString(
    "en-IN"
  )}`;
}

function getHealthIcon(health) {
  switch (health) {
    case "healthy":
      return "✓";

    case "needs_attention":
      return "!";

    case "critical":
      return "!";

    default:
      return "—";
  }
}

export default BusinessHealthCard;