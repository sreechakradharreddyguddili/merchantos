function ActionHistory({
  actions = [],
}) {
  return (
    <section className="page-card history-section">

      <div className="card-header">

        <div>
          <span className="section-label">
            HISTORY
          </span>

          <h2>
            Action History
          </h2>

          <p className="section-subtitle">
            Completed, rejected, and failed
            actions from your Growth Agent.
          </p>
        </div>

        <span className="count-badge">
          {actions.length}
        </span>

      </div>

      {actions.length === 0 ? (
        <div className="history-empty">

          <div className="empty-icon">
            ✓
          </div>

          <strong>
            No action history
          </strong>

          <p>
            Completed, rejected, and failed
            actions will appear here.
          </p>

        </div>
      ) : (
        <div className="history-list">

          {actions.map(
            (action) => (
              <HistoryRow
                key={
                  action._id
                }
                action={
                  action
                }
              />
            )
          )}

        </div>
      )}

    </section>
  );
}

function HistoryRow({
  action,
}) {
  const status =
    String(
      action?.status ||
        "completed"
    ).toLowerCase();

  const title =
    action?.title ||
    "Agent Action";

  const type =
    formatType(
      action?.type ||
        ""
    );

  const impact =
    Number(
      action?.estimatedImpact ||
        0
    );

  const date =
    action?.executedAt ||
    action?.rejectedAt ||
    action?.updatedAt ||
    action?.createdAt;

  const recovery =
    action?.executionResult
      ?.recovery || null;

  const executionError =
    action?.executionResult
      ?.error || null;

  const isFailed =
    status === "failed";

  return (
    <article className="history-row">

      <div className="history-left">

        <div
          className={`history-check history-check-${status}`}
        >
          {status ===
          "completed"
            ? "✓"
            : status ===
              "rejected"
            ? "×"
            : status ===
              "failed"
            ? "!"
            : "..."}
        </div>

        <div className="history-main">

          <div className="history-title-line">

            <strong>
              {title}
            </strong>

            <span
              className={`history-status history-status-${status}`}
            >
              {formatStatus(
                status
              )}
            </span>

          </div>

          <span className="history-type">
            {type}
          </span>

        </div>

      </div>

      <div className="history-details">

        <div>
          <span>
            PRIORITY
          </span>

          <strong>
            {action?.priority ||
              "MEDIUM"}
          </strong>
        </div>

        <div>
          <span>
            IMPACT
          </span>

          <strong>
            {impact > 0
              ? `₹${impact.toLocaleString(
                  "en-IN"
                )}`
              : "—"}
          </strong>
        </div>

        <div>
          <span>
            {status ===
            "completed"
              ? "EXECUTED"
              : status ===
                "failed"
              ? "FAILED"
              : "UPDATED"}
          </span>

          <strong>
            {date
              ? formatDate(date)
              : "—"}
          </strong>
        </div>

      </div>

      {/* FAILURE DETAILS */}

      {isFailed && (
        <div className="history-recovery-panel">

          <div className="history-recovery-header">

            <span className="section-label">
              GRACEFUL FAILURE
            </span>

            <span className="history-recovery-badge">
              SAFE STOP
            </span>

          </div>

          {executionError && (
            <div className="history-recovery-item">

              <span>
                ERROR
              </span>

              <strong>
                {executionError}
              </strong>

            </div>
          )}

          {recovery && (
            <>
              <div className="history-recovery-item">

                <span>
                  RECOVERY AVAILABLE
                </span>

                <strong>
                  {recovery.available
                    ? "YES"
                    : "NO"}
                </strong>

              </div>

              {recovery.strategy && (
                <div className="history-recovery-message">

                  <span>
                    RECOVERY STRATEGY
                  </span>

                  <p>
                    {recovery.strategy}
                  </p>

                </div>
              )}

              {recovery.nextStep && (
                <div className="history-recovery-message">

                  <span>
                    NEXT STEP
                  </span>

                  <p>
                    {recovery.nextStep}
                  </p>

                </div>
              )}
            </>
          )}

          {!recovery && (
            <div className="history-recovery-message">

              <span>
                RECOVERY
              </span>

              <p>
                The action failed safely without
                applying partial business changes.
              </p>

            </div>
          )}

        </div>
      )}

      {/* SUCCESS OUTCOME */}

      {status === "completed" &&
        action?.executionResult && (
          <div className="history-success-panel">

            <div className="history-success-header">

              <span className="section-label">
                EXECUTION OUTCOME
              </span>

              <span className="history-success-badge">
                COMPLETED
              </span>

            </div>

            {action.executionResult
              ?.message && (
              <p>
                {
                  action.executionResult
                    .message
                }
              </p>
            )}

            {action.executionResult
              ?.recoveryStrategy && (
              <div className="history-recovery-message">

                <span>
                  RETRY STRATEGY
                </span>

                <p>
                  {
                    action.executionResult
                      .recoveryStrategy
                  }
                </p>

              </div>
            )}

          </div>
        )}

    </article>
  );
}

function formatType(value) {
  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );
}

function formatStatus(value) {
  return String(value)
    .replaceAll("_", " ")
    .toUpperCase();
}

function formatDate(value) {
  return new Date(
    value
  ).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default ActionHistory;