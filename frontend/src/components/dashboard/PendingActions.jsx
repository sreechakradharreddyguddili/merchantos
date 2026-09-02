import EmptyState from "../common/EmptyState";

function PendingActions({
  actions = [],
}) {
  return (
    <section className="page-card">

      <div className="card-header">

        <div>
          <span className="section-label">
            AGENT QUEUE
          </span>

          <h2>
            Pending Actions
          </h2>
        </div>

        <div className="count-badge">
          {actions.length}
        </div>

      </div>

      {actions.length === 0 ? (
        <EmptyState
          title="No pending actions"
          message="Your AI agent has no actions waiting for review."
        />
      ) : (
        <div className="pending-action-list">

          {actions.map((action) => (
            <div
              className="pending-action-card"
              key={action._id}
            >

              <div className="pending-action-main">

                <div className="pending-action-icon">
                  {action.financialAction
                    ? "₹"
                    : "✦"}
                </div>

                <div className="pending-action-content">

                  <h3>
                    {action.title ||
                      "AI Growth Action"}
                  </h3>

                  <p>
                    {String(
                      action.type ||
                        "ACTION"
                    ).toUpperCase()}
                  </p>

                  <div className="pending-action-meta">

                    <span
                      className={`priority priority-${String(
                        action.priority ||
                          "MEDIUM"
                      ).toLowerCase()}`}
                    >
                      {action.priority ||
                        "MEDIUM"}
                    </span>

                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default PendingActions;