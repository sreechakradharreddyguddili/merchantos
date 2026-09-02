import EmptyState from "../common/EmptyState";
import Button from "../common/Button";

function PendingActions({
  actions = [],
  loading = false,
  onApprove,
  onReject,
  onExecute,
}) {
  return (
    <section className="page-card">
      <div className="card-header">
        <div>
          <span className="section-label">
            AGENT QUEUE
          </span>

          <h2>Pending Actions</h2>

          <p className="section-subtitle">
            AI decisions remain bounded by policy
            and merchant approval before execution.
          </p>
        </div>

        <span className="count-badge">
          {actions.length}
        </span>
      </div>

      {actions.length === 0 ? (
        <EmptyState
          title="No pending actions"
          message="All generated actions have been processed."
        />
      ) : (
        <div className="agent-action-list">
          {actions.map((action) => (
            <ActionCard
              key={action._id}
              action={action}
              loading={loading}
              onApprove={onApprove}
              onReject={onReject}
              onExecute={onExecute}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ActionCard({
  action,
  loading,
  onApprove,
  onReject,
  onExecute,
}) {
  const requiresApproval =
    action?.requiresApproval === true;

  const approved =
    action?.status === "approved";

  const financial =
    action?.financialAction === true;

  const risk =
    action?.policyDecision?.risk ||
    action?.risk ||
    "LOW";

  const policyReason =
    action?.policyDecision?.reason ||
    (requiresApproval
      ? "Merchant approval is required before execution."
      : "This action is permitted for automatic execution.");

  const evidence =
    Array.isArray(
      action?.decisionEvidence?.evidence
    )
      ? action.decisionEvidence.evidence
      : [];

  const expectedOutcome =
    action?.decisionEvidence
      ?.expectedOutcome ||
    "";

  const sourceChannel =
    action?.decisionEvidence
      ?.sourceChannel ||
    "growth_agent";

  const recommendationId =
    action?.decisionEvidence
      ?.recommendationId ||
    "";

  const status =
    String(
      action?.status || "pending"
    ).toUpperCase();

  return (
    <article className="agent-action-card">

      {/* =================================================
          ACTION HEADER
          ================================================= */}

      <div className="action-card-main">

        <div className="action-type-icon">
          {financial ? "Rs." : "AI"}
        </div>

        <div className="action-card-content">

          <div className="action-title-row">

            <div>
              <span className="recommendation-type">
                {formatType(
                  action?.type || "ACTION"
                )}
              </span>

              <h3>
                {action?.title ||
                  "AI Growth Action"}
              </h3>
            </div>

            <span
              className={`priority priority-${String(
                action?.priority ||
                  "MEDIUM"
              ).toLowerCase()}`}
            >
              {action?.priority ||
                "MEDIUM"}
            </span>

          </div>

          <p>
            {action?.description ||
              "No description provided."}
          </p>

        </div>

      </div>

      {/* =================================================
          ACTION META
          ================================================= */}

      <div className="action-meta">

        <Meta
          label="PRIORITY"
          value={
            action?.priority ||
            "MEDIUM"
          }
        />

        <Meta
          label="ESTIMATED IMPACT"
          value={formatCurrency(
            action?.estimatedImpact
          )}
        />

        <Meta
          label="FINANCIAL"
          value={
            financial
              ? "Yes"
              : "No"
          }
        />

        <Meta
          label="STATUS"
          value={status}
        />

      </div>

      {/* =================================================
          POLICY GATE
          ================================================= */}

      <div className="agent-policy-panel">

        <div className="agent-policy-header">

          <div>
            <span className="section-label">
              AGENT POLICY
            </span>

            <h4>
              Decision & Approval Gate
            </h4>
          </div>

          <span
            className={`agent-risk-badge agent-risk-${String(
              risk
            ).toLowerCase()}`}
          >
            RISK: {String(risk).toUpperCase()}
          </span>

        </div>

        <div className="agent-policy-grid">

          <PolicyItem
            label="APPROVAL"
            value={
              requiresApproval
                ? approved
                  ? "Approved"
                  : "Required"
                : "Automatic"
            }
          />

          <PolicyItem
            label="ACTOR"
            value={
              approved
                ? "Merchant"
                : "AI Agent"
            }
          />

          <PolicyItem
            label="SOURCE"
            value={sourceChannel}
          />

          <PolicyItem
            label="RECOMMENDATION"
            value={
              recommendationId ||
              "AI Decision"
            }
          />

        </div>

        <div className="agent-policy-reason">

          <span>
            POLICY DECISION
          </span>

          <p>
            {policyReason}
          </p>

        </div>

      </div>

      {/* =================================================
          DECISION EVIDENCE
          ================================================= */}

      {(evidence.length > 0 ||
        expectedOutcome) && (
        <div className="agent-evidence-panel">

          <div>
            <span className="section-label">
              DECISION EVIDENCE
            </span>

            <h4>
              Why the agent recommended this
            </h4>
          </div>

          {evidence.length > 0 && (
            <ul>
              {evidence
                .slice(0, 6)
                .map(
                  (
                    item,
                    index
                  ) => (
                    <li
                      key={index}
                    >
                      {item}
                    </li>
                  )
                )}
            </ul>
          )}

          {expectedOutcome && (
            <div className="agent-expected-outcome">

              <span>
                EXPECTED OUTCOME
              </span>

              <p>
                {expectedOutcome}
              </p>

            </div>
          )}

        </div>
      )}

      {/* =================================================
          ACTION BUTTONS
          ================================================= */}

      <div className="action-buttons">

        {requiresApproval &&
          !approved && (
            <>
              <Button
                onClick={() =>
                  onApprove?.(
                    action._id
                  )
                }
                loading={loading}
              >
                Approve
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  onReject?.(
                    action._id
                  )
                }
                loading={loading}
              >
                Reject
              </Button>
            </>
          )}

        {!requiresApproval && (
          <Button
            onClick={() =>
              onExecute?.(
                action._id
              )
            }
            loading={loading}
          >
            Execute
          </Button>
        )}

        {requiresApproval &&
          approved && (
            <Button
              onClick={() =>
                onExecute?.(
                  action._id
                )
              }
              loading={loading}
            >
              Execute Approved Action
            </Button>
          )}

      </div>

      {/* =================================================
          APPROVAL STATUS
          ================================================= */}

      {requiresApproval && (
        <div
          className={`agent-approval-status ${
            approved
              ? "agent-approval-approved"
              : "agent-approval-pending"
          }`}
        >
          <span>
            {approved
              ? "✓"
              : "!"}
          </span>

          <div>
            <strong>
              {approved
                ? "Merchant approval recorded"
                : "Merchant approval required"}
            </strong>

            <p>
              {approved
                ? "The action passed the approval gate and is ready for controlled execution."
                : "The agent cannot execute this action until the merchant approves it."}
            </p>
          </div>
        </div>
      )}

    </article>
  );
}

function Meta({
  label,
  value,
}) {
  return (
    <div>
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function PolicyItem({
  label,
  value,
}) {
  return (
    <div>
      <span>
        {label}
      </span>

      <strong>
        {formatType(value)}
      </strong>
    </div>
  );
}

function formatType(value) {
  return String(
    value || ""
  )
    .replaceAll(
      "_",
      " "
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );
}

function formatCurrency(value) {
  const number =
    Number(value || 0);

  return `Rs. ${number.toLocaleString(
    "en-IN"
  )}`;
}

export default PendingActions;