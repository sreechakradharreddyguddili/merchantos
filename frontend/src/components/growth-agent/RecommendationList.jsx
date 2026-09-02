import EmptyState from "../common/EmptyState";

function RecommendationList({
  recommendations = [],
  analysisId,
  onCreateAction,
  creatingRecommendationId = null,
  createdRecommendationIds = [],
}) {
  return (
    <section className="page-card recommendation-section">

      <div className="card-header">

        <div>

          <span className="section-label">
            AI RECOMMENDATIONS
          </span>

          <h2>
            Growth Opportunities
          </h2>

          <p className="section-subtitle">
            Opportunities identified from
            your latest business analysis.
          </p>

        </div>

        <span className="count-badge">
          {recommendations.length}
        </span>

      </div>

      {recommendations.length ===
      0 ? (

        <EmptyState
          title="No recommendations"
          message="Run a new AI analysis to discover growth opportunities."
        />

      ) : (

        <div className="recommendation-list">

          {recommendations.map(
            (
              recommendation,
              index
            ) => {

              const recommendationId =
                recommendation?.id ||
                `RECOMMENDATION_${index}`;

              const alreadyCreated =
                createdRecommendationIds.includes(
                  recommendationId
                );

              const isCreating =
                creatingRecommendationId ===
                recommendationId;

              return (
                <RecommendationCard
                  key={
                    recommendationId
                  }
                  recommendation={
                    recommendation
                  }
                  analysisId={
                    analysisId
                  }
                  recommendationId={
                    recommendationId
                  }
                  onCreateAction={
                    onCreateAction
                  }
                  alreadyCreated={
                    alreadyCreated
                  }
                  isCreating={
                    isCreating
                  }
                />
              );
            }
          )}

        </div>
      )}

    </section>
  );
}

function RecommendationCard({
  recommendation,
  analysisId,
  recommendationId,
  onCreateAction,
  alreadyCreated,
  isCreating,
}) {
  const title =
    recommendation?.action ||
    "AI Growth Recommendation";

  const reason =
    recommendation?.reason ||
    "The AI agent identified this as a potential growth opportunity.";

  const priority =
    recommendation?.priority ||
    "MEDIUM";

  const product =
    recommendation?.product ||
    recommendation?.recommended_product ||
    null;

  const estimatedImpact =
    Number(
      recommendation?.estimated_impact
    );

  const hasImpact =
    Number.isFinite(
      estimatedImpact
    ) &&
    estimatedImpact > 0;

  const financialAction =
    recommendation?.financial_action ===
    true;

  const requiresApproval =
    recommendation?.requires_approval !==
    false;

  const opportunityScore =
    recommendation?.opportunity_score;

  const recommendedActions =
    Array.isArray(
      recommendation?.recommended_actions
    )
      ? recommendation.recommended_actions
      : [];

  const handleCreateAction = () => {
    if (
      !analysisId ||
      alreadyCreated ||
      isCreating
    ) {
      return;
    }

    onCreateAction(
      analysisId,
      recommendationId
    );
  };

  return (
    <article className="recommendation-card">

      <div className="recommendation-main">

        <div className="recommendation-icon">
          ✦
        </div>

        <div className="recommendation-content">

          <div className="recommendation-heading">

            <div>

              <span className="recommendation-type">
                {formatType(
                  recommendationId
                )}
              </span>

              <h3>
                {title}
              </h3>

            </div>

            <span
              className={`priority priority-${String(
                priority
              ).toLowerCase()}`}
            >
              {String(
                priority
              ).toUpperCase()}
            </span>

          </div>

          <p className="recommendation-reason">
            {reason}
          </p>

          {/* PRODUCT */}

          {product && (
            <div className="recommendation-product">

              <div className="recommendation-product-icon">
                +
              </div>

              <div>
                <span>
                  RECOMMENDED PRODUCT
                </span>

                <strong>
                  {product}
                </strong>
              </div>

            </div>
          )}

          {/* OPPORTUNITY SCORE */}

          {opportunityScore !==
            undefined && (
            <div className="recommendation-detail">

              <span>
                OPPORTUNITY SCORE
              </span>

              <strong>
                {Number(
                  opportunityScore
                ).toFixed(1)}
              </strong>

            </div>
          )}

          {/* RECOMMENDED ACTIONS */}

          {recommendedActions.length >
            0 && (
            <div className="recommendation-strategy">

              <span>
                RECOMMENDED APPROACH
              </span>

              <ul>
                {recommendedActions
                  .slice(0, 3)
                  .map(
                    (
                      action,
                      index
                    ) => (
                      <li
                        key={
                          index
                        }
                      >
                        {String(
                          action
                        )}
                      </li>
                    )
                  )}
              </ul>

            </div>
          )}

          <div className="recommendation-tags">

            {financialAction && (
              <span className="recommendation-tag">
                Financial
              </span>
            )}

            {requiresApproval ? (
              <span className="recommendation-tag recommendation-tag-warning">
                Approval required
              </span>
            ) : (
              <span className="recommendation-tag recommendation-tag-success">
                Automatic
              </span>
            )}

          </div>

          <button
            type="button"
            className="button button-primary recommendation-action-button"
            onClick={
              handleCreateAction
            }
            disabled={
              alreadyCreated ||
              isCreating ||
              !analysisId
            }
          >
            {isCreating
              ? "Creating..."
              : alreadyCreated
              ? "Action Created"
              : "Create Action"}
          </button>

        </div>

      </div>

      {/* IMPACT */}

      <div className="recommendation-impact">

        <span>
          ESTIMATED IMPACT
        </span>

        <strong>
          {hasImpact
            ? formatCurrency(
                estimatedImpact
              )
            : "Not estimated"}
        </strong>

        {!hasImpact && (
          <small>
            No financial estimate was
            provided by the AI.
          </small>
        )}

      </div>

    </article>
  );
}

function formatType(value) {
  return String(value)
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
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

export default RecommendationList;