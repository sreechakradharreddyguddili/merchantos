import React from "react";

const formatCurrency = (
  value
) => {
  const amount = Number(
    value || 0
  );

  return `₹${amount.toLocaleString(
    "en-IN"
  )}`;
};

const formatDate = (
  value
) => {
  if (!value) {
    return "Not available";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not available";
  }

  return date.toLocaleString(
    "en-IN"
  );
};

const formatType = (
  type
) => {
  if (!type) {
    return "Agent Action";
  }

  return String(
    type
  )
    .replaceAll(
      "_",
      " "
    )
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

function AgentAuditTrail({
  actions = [],
}) {
  const auditActions =
    Array.isArray(actions)
      ? actions.filter(
          (action) =>
            Array.isArray(
              action?.auditTrail
            ) &&
            action.auditTrail
              .length > 0
        )
      : [];

  return (
    <section className="page-card agent-audit-card">

      <div className="card-header">

        <div>
          <span className="section-label">
            GOVERNANCE
          </span>

          <h2>
            Agent Decision & Audit Trail
          </h2>

          <p className="audit-description">
            Transparent record of why an
            agent action was created,
            approved, rejected, executed,
            or failed.
          </p>
        </div>

        <span className="count-badge">
          {auditActions.length}
        </span>

      </div>

      {auditActions.length ===
      0 ? (
        <div className="agent-audit-empty">
          No audited agent actions yet.
          Generate a recommendation
          and create an action to see
          the complete decision trail.
        </div>
      ) : (
        <div className="agent-audit-list">

          {auditActions.map(
            (action) => (
              <div
                className="agent-audit-action"
                key={
                  action._id
                }
              >

                <div className="agent-audit-action-header">

                  <div>
                    <span className="recommendation-type">
                      {formatType(
                        action.type
                      )}
                    </span>

                    <h3>
                      {action.title ||
                        "AI Growth Action"}
                    </h3>
                  </div>

                  <span
                    className={`status-badge status-${action.status}`}
                  >
                    {action.status}
                  </span>

                </div>

                {/* DECISION SUMMARY */}

                <div className="agent-audit-summary">

                  <div>
                    <span>
                      Estimated Impact
                    </span>

                    <strong>
                      {formatCurrency(
                        action.estimatedImpact
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Risk
                    </span>

                    <strong>
                      {action
                        ?.policyDecision
                        ?.risk ||
                        action
                          ?.risk ||
                        "LOW"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Approval
                    </span>

                    <strong>
                      {action
                        ?.requiresApproval
                        ? "Required"
                        : "Automatic"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Source
                    </span>

                    <strong>
                      {action
                        ?.decisionEvidence
                        ?.sourceChannel ||
                        "growth_agent"}
                    </strong>
                  </div>

                </div>

                {/* EVIDENCE */}

                {action
                  ?.decisionEvidence
                  ?.evidence
                  ?.length > 0 && (
                  <div className="agent-audit-evidence">

                    <span className="section-label">
                      DECISION EVIDENCE
                    </span>

                    <ul>
                      {action.decisionEvidence.evidence
                        .slice(0, 6)
                        .map(
                          (
                            evidence,
                            index
                          ) => (
                            <li
                              key={
                                index
                              }
                            >
                              {evidence}
                            </li>
                          )
                        )}
                    </ul>

                  </div>
                )}

                {/* AUDIT EVENTS */}

                <div className="agent-audit-events">

                  <span className="section-label">
                    ACTION LIFECYCLE
                  </span>

                  {action.auditTrail.map(
                    (
                      event,
                      index
                    ) => (
                      <div
                        className="agent-audit-event"
                        key={`${action._id}-${index}`}
                      >

                        <div className="agent-audit-event-line">

                          <span className="agent-audit-dot" />

                          <div>

                            <strong>
                              {formatType(
                                event.event
                              )}
                            </strong>

                            <span>
                              {formatDate(
                                event.timestamp
                              )}
                            </span>

                          </div>

                        </div>

                        <div className="agent-audit-event-details">

                          {event.fromStatus && (
                            <span>
                              {event.fromStatus}
                              {" → "}
                              {event.toStatus}
                            </span>
                          )}

                          <span>
                            Actor:{" "}
                            {event.actor ||
                              "system"}
                          </span>

                          {event.reason && (
                            <p>
                              {event.reason}
                            </p>
                          )}

                        </div>

                      </div>
                    )
                  )}

                </div>

                {/* EXECUTION RESULT */}

                {action.executionResult && (
                  <div className="agent-audit-result">

                    <span className="section-label">
                      OUTCOME
                    </span>

                    <pre>
                      {JSON.stringify(
                        action.executionResult,
                        null,
                        2
                      )}
                    </pre>

                  </div>
                )}

              </div>
            )
          )}

        </div>
      )}

    </section>
  );
}

export default AgentAuditTrail;