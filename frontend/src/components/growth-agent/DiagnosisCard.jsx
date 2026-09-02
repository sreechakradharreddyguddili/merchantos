function DiagnosisCard({
  diagnosis = {},
}) {
  const businessHealth =
    diagnosis.business_health ||
    diagnosis.businessHealth ||
    "unknown";

  const issues = Array.isArray(
    diagnosis.issues
  )
    ? diagnosis.issues
    : [];

  const paymentAnalysis =
    diagnosis.payment_analysis ||
    diagnosis.paymentAnalysis ||
    {};

  return (
    <section className="page-card diagnosis-card">

      <div className="section-label">
        DIAGNOSIS
      </div>

      <h2>
        What the Agent Found
      </h2>

      {/* BUSINESS HEALTH */}

      <div className="diagnosis-section diagnosis-health-section">

        <div className="diagnosis-section-title">
          Business Health
        </div>

        <div className="diagnosis-health-value">
          {formatLabel(
            businessHealth
          )}
        </div>

      </div>

      {/* ISSUES */}

      <div className="diagnosis-section">

        <div className="diagnosis-section-heading">

          <div className="diagnosis-section-title">
            Issues
          </div>

          <span className="diagnosis-count">
            {issues.length}
          </span>

        </div>

        {issues.length === 0 ? (

          <div className="diagnosis-empty">
            No major issues detected.
          </div>

        ) : (

          <div className="issue-list">

            {issues.map(
              (
                issue,
                index
              ) => {

                const severity =
                  String(
                    issue?.severity ||
                      "medium"
                  ).toLowerCase();

                const issueMetrics =
                  issue?.metrics ||
                  {};

                const evidence =
                  Array.isArray(
                    issue?.evidence
                  )
                    ? issue.evidence
                    : issue?.evidence
                    ? [
                        issue.evidence,
                      ]
                    : [];

                return (
                  <article
                    className="issue-card"
                    key={
                      issue?.id ||
                      issue?.type ||
                      index
                    }
                  >

                    <div className="issue-header">

                      <div className="issue-heading-content">

                        <span className="issue-type">
                          {formatLabel(
                            issue?.type ||
                              "Business Issue"
                          )}
                        </span>

                        <h3>
                          {formatLabel(
                            issue?.title ||
                              "Growth Opportunity"
                          )}
                        </h3>

                      </div>

                      <span
                        className={`severity-badge severity-${severity}`}
                      >
                        {formatLabel(
                          severity
                        )}
                      </span>

                    </div>

                    {issue?.product && (
                      <div className="issue-product">
                        <span>
                          PRODUCT
                        </span>

                        <strong>
                          {issue.product}
                        </strong>
                      </div>
                    )}

                    {evidence.length >
                      0 && (
                      <div className="issue-block">

                        <div className="issue-block-title">
                          Evidence
                        </div>

                        <ul className="issue-evidence-list">

                          {evidence.map(
                            (
                              item,
                              evidenceIndex
                            ) => (
                              <li
                                key={
                                  evidenceIndex
                                }
                              >
                                {String(
                                  item
                                )}
                              </li>
                            )
                          )}

                        </ul>

                      </div>
                    )}

                    {issue?.impact && (
                      <div className="issue-block">

                        <div className="issue-block-title">
                          Impact
                        </div>

                        <p>
                          {String(
                            issue.impact
                          )}
                        </p>

                      </div>
                    )}

                    {Object.keys(
                      issueMetrics
                    ).length >
                      0 && (
                      <div className="issue-metrics-grid">

                        {Object.entries(
                          issueMetrics
                        ).map(
                          (
                            [
                              key,
                              value,
                            ]
                          ) => (
                            <div
                              className="issue-metric"
                              key={key}
                            >

                              <span>
                                {formatLabel(
                                  key
                                )}
                              </span>

                              <strong>
                                {formatValue(
                                  value
                                )}
                              </strong>

                            </div>
                          )
                        )}

                      </div>
                    )}

                    {issue?.opportunity_score !==
                      undefined && (
                      <div className="issue-footer">

                        <span>
                          Opportunity Score
                        </span>

                        <strong>
                          {formatValue(
                            issue.opportunity_score
                          )}
                        </strong>

                      </div>
                    )}

                    {issue?.estimated_revenue_opportunity !==
                      undefined && (
                      <div className="issue-footer">

                        <span>
                          Estimated Revenue Opportunity
                        </span>

                        <strong>
                          {formatCurrency(
                            issue.estimated_revenue_opportunity
                          )}
                        </strong>

                      </div>
                    )}

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* PAYMENT ANALYSIS */}

      <div className="diagnosis-section">

        <div className="diagnosis-section-title">
          Payment Analysis
        </div>

        <div className="payment-analysis-grid">

          <div className="payment-stat">

            <span>
              Total Failures
            </span>

            <strong>
              {formatNumber(
                paymentAnalysis.total_failures ??
                  paymentAnalysis.totalFailures ??
                  0
              )}
            </strong>

          </div>

          <div className="payment-stat">

            <span>
              Estimated Lost Revenue
            </span>

            <strong>
              {formatCurrency(
                paymentAnalysis.estimated_lost_revenue ??
                  paymentAnalysis.estimatedLostRevenue ??
                  0
              )}
            </strong>

          </div>

        </div>

      </div>

    </section>
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
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatNumber(value) {
  const number = Number(
    value || 0
  );

  return number.toLocaleString(
    "en-IN"
  );
}

function formatValue(value) {
  if (
    typeof value ===
    "number"
  ) {
    return value.toLocaleString(
      "en-IN"
    );
  }

  return String(value);
}

function formatCurrency(value) {
  const number = Number(
    value || 0
  );

  return `₹${number.toLocaleString(
    "en-IN"
  )}`;
}

export default DiagnosisCard;