import { useEffect, useState } from "react";

import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";

import AgentHero from "../components/growth-agent/AgentHero";
import BusinessHealthCard from "../components/growth-agent/BusinessHealthCard";
import DiagnosisCard from "../components/growth-agent/DiagnosisCard";
import RecommendationList from "../components/growth-agent/RecommendationList";
import PendingActions from "../components/growth-agent/PendingActions";
import ActionHistory from "../components/growth-agent/ActionHistory";

import {
  getLatestGrowthAnalysis,
  generateGrowthAnalysis,
} from "../services/growthAnalysisService";

import {
  getPendingActions,
  getAgentActionHistory,
  generateAgentActions,
  approveAgentAction,
  rejectAgentAction,
  executeAgentAction,
} from "../services/agentActionService";

function GrowthAgent() {
  const [analysis, setAnalysis] =
    useState(null);

  const [pendingActions, setPendingActions] =
    useState([]);

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [analysisLoading, setAnalysisLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [
    creatingRecommendationId,
    setCreatingRecommendationId,
  ] = useState(null);

  const [
    createdRecommendationIds,
    setCreatedRecommendationIds,
  ] = useState([]);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const analysisPromise =
        getLatestGrowthAnalysis().catch(
          (err) => {
            if (
              err?.message ===
                "No growth analysis found" ||
              err?.message ===
                "No growth analysis found."
            ) {
              return null;
            }

            throw err;
          }
        );

      const [
        analysisResponse,
        pendingResponse,
        historyResponse,
      ] = await Promise.all([
        analysisPromise,
        getPendingActions(),
        getAgentActionHistory(),
      ]);

      const latestAnalysis =
        analysisResponse?.data
          ?.analysis || null;

      const latestPending =
        pendingResponse?.data
          ?.actions || [];

      const latestHistory =
        historyResponse?.data
          ?.actions || [];

      setAnalysis(
        latestAnalysis
      );

      setPendingActions(
        latestPending
      );

      setHistory(
        latestHistory
      );

      /*
       * Mark recommendations whose
       * action is already active.
       */
      if (
        latestAnalysis
      ) {
        const activeTypes =
          new Set(
            latestPending.map(
              (action) =>
                action?.type
            )
          );

        const activeRecommendationIds =
          (
            latestAnalysis
              ?.recommendations ||
            []
          )
            .filter(
              (recommendation) => {

                const id =
                  recommendation?.id ||
                  "";

                return (
                  (id ===
                    "SMART_CROSS_SELL" &&
                    activeTypes.has(
                      "cross_sell"
                    )) ||
                  (id ===
                    "PAYMENT_RECOVERY" &&
                    activeTypes.has(
                      "payment_recovery"
                    )) ||
                  (id ===
                    "CONVERSION_EXPERIMENT" &&
                    activeTypes.has(
                      "conversion_experiment"
                    )) ||
                  (id ===
                    "INVENTORY_REPLENISHMENT" &&
                    activeTypes.has(
                      "inventory_replenishment"
                    )) ||
                  (id ===
                    "AI_BUYER_GROWTH" &&
                    activeTypes.has(
                      "ai_buyer_growth"
                  )) ||
                  (id ===
                    "CAMPAIGN" &&
                    activeTypes.has(
                      "campaign"
                    ))
                );
              }
            )
            .map(
              (recommendation) =>
                recommendation.id
            );

        setCreatedRecommendationIds(
          activeRecommendationIds
        );
      }
    } catch (err) {
      console.error(
        "Growth Agent load error:",
        err
      );

      setError(
        err?.message ||
          "Failed to load Growth Agent."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnalysis =
    async () => {
      try {
        setAnalysisLoading(true);

        setError("");
        setSuccessMessage("");

        /*
         * Generate a new AI analysis.
         */
        await generateGrowthAnalysis();

        /*
         * Load the newly created analysis.
         */
        await loadData();

        setSuccessMessage(
          "AI growth analysis generated successfully."
        );
      } catch (err) {
        console.error(
          "Growth analysis error:",
          err
        );

        setError(
          err?.message ||
            "Failed to generate growth analysis."
        );
      } finally {
        setAnalysisLoading(false);
      }
    };

  const handleCreateRecommendationAction =
    async (
      analysisId,
      recommendationId
    ) => {
      try {
        setCreatingRecommendationId(
          recommendationId
        );

        setActionLoading(true);

        setError("");
        setSuccessMessage("");

        const response =
          await generateAgentActions(
            analysisId,
            recommendationId
          );

        const newActions =
          response?.data?.actions ||
          [];

        /*
         * Add the new action directly
         * without reloading the page.
         */
        if (
          newActions.length > 0
        ) {
          setPendingActions(
            (previous) => {

              const existingIds =
                new Set(
                  previous.map(
                    (action) =>
                      String(
                        action?._id
                      )
                  )
                );

              const uniqueActions =
                newActions.filter(
                  (action) =>
                    !existingIds.has(
                      String(
                        action?._id
                      )
                    )
                );

              return [
                ...uniqueActions,
                ...previous,
              ];
            }
          );
        }

        const actuallyCreated =
          newActions.some(
            (action) =>
              action?.alreadyExists ===
              false
          );

        setCreatedRecommendationIds(
          (previous) => {

            if (
              previous.includes(
                recommendationId
              )
            ) {
              return previous;
            }

            return [
              ...previous,
              recommendationId,
            ];
          }
        );

        setSuccessMessage(
          actuallyCreated
            ? "Agent action created and moved to Pending Actions."
            : "An active action already exists for this recommendation."
        );
      } catch (err) {
        console.error(
          "Create recommendation action error:",
          err
        );

        setError(
          err?.message ||
            "Failed to create agent action."
        );
      } finally {
        setCreatingRecommendationId(
          null
        );

        setActionLoading(false);
      }
    };

  const handleApprove =
    async (actionId) => {
      try {
        setActionLoading(true);

        setError("");
        setSuccessMessage("");

        const response =
          await approveAgentAction(
            actionId
          );

        const updatedAction =
          response?.data?.action;

        if (
          updatedAction
        ) {
          setPendingActions(
            (previous) =>
              previous.map(
                (action) =>
                  String(
                    action?._id
                  ) ===
                  String(actionId)
                    ? updatedAction
                    : action
              )
          );
        } else {
          const response =
            await getPendingActions();

          setPendingActions(
            response?.data
              ?.actions || []
          );
        }

        setSuccessMessage(
          "Agent action approved."
        );
      } catch (err) {
        console.error(
          "Approve action error:",
          err
        );

        setError(
          err?.message ||
            "Failed to approve action."
        );
      } finally {
        setActionLoading(false);
      }
    };

  const handleReject =
    async (actionId) => {
      try {
        setActionLoading(true);

        setError("");
        setSuccessMessage("");

        const rejectedAction =
          pendingActions.find(
            (action) =>
              String(
                action?._id
              ) ===
              String(actionId)
          );

        await rejectAgentAction(
          actionId
        );

        setPendingActions(
          (previous) =>
            previous.filter(
              (action) =>
                String(
                  action?._id
                ) !==
                String(actionId)
            )
        );

        if (
          rejectedAction
        ) {
          setHistory(
            (previous) => [
              {
                ...rejectedAction,

                status:
                  "rejected",

                rejectedAt:
                  new Date().toISOString(),
              },

              ...previous,
            ]
          );
        }

        setSuccessMessage(
          "Agent action rejected."
        );
      } catch (err) {
        console.error(
          "Reject action error:",
          err
        );

        setError(
          err?.message ||
            "Failed to reject action."
        );
      } finally {
        setActionLoading(false);
      }
    };

  const handleExecute =
    async (actionId) => {
      try {
        setActionLoading(true);

        setError("");
        setSuccessMessage("");

        const action =
          pendingActions.find(
            (item) =>
              String(
                item?._id
              ) ===
              String(actionId)
          );

        const response =
          await executeAgentAction(
            actionId
          );

        const completedAction =
          response?.data?.action;

        setPendingActions(
          (previous) =>
            previous.filter(
              (item) =>
                String(
                  item?._id
                ) !==
                String(actionId)
            )
        );

        if (
          completedAction
        ) {
          setHistory(
            (previous) => [
              completedAction,
              ...previous,
            ]
          );
        } else if (
          action
        ) {
          setHistory(
            (previous) => [
              {
                ...action,

                status:
                  "completed",

                executedAt:
                  new Date().toISOString(),
              },

              ...previous,
            ]
          );
        }

        setSuccessMessage(
          "Agent action executed successfully."
        );
      } catch (err) {
        console.error(
          "Execute action error:",
          err
        );

        setError(
          err?.message ||
            "Failed to execute action."
        );
      } finally {
        setActionLoading(false);
      }
    };

  if (loading) {
    return (
      <Loading
        message="Loading AI Growth Agent..."
      />
    );
  }

  const health =
    analysis?.businessHealth ||
    analysis?.diagnosis
      ?.business_health ||
    "unknown";

  const diagnosis =
    analysis?.diagnosis || {};

  const recommendations =
    Array.isArray(
      analysis?.recommendations
    )
      ? analysis.recommendations
      : [];

  const metrics =
    analysis?.overview || {};

  return (
    <div className="page growth-agent-page">

      {successMessage && (
        <Alert
          type="success"
          message={
            successMessage
          }
          onClose={() =>
            setSuccessMessage("")
          }
        />
      )}

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() =>
            setError("")
          }
        />
      )}

      {/* HEADER */}

      <div className="growth-page-header">

        <div>
          <span className="eyebrow">
            MERCHANT COMMAND CENTER
          </span>

          <h1>
            AI Growth Agent
          </h1>

          <p>
            Turn your business data into
            practical growth actions.
          </p>
        </div>

        <button
          type="button"
          className="button button-secondary"
          onClick={loadData}
          disabled={
            actionLoading ||
            analysisLoading
          }
        >
          Refresh
        </button>

      </div>

      {/* HERO */}

      <AgentHero />

      {/* WORKFLOW */}

      <section className="growth-control-bar">

        <div className="growth-control-info">

          <span className="section-label">
            AI WORKFLOW
          </span>

          <h3>
            Growth Intelligence
          </h3>

          <p>
            Analyze your commerce data and
            convert AI recommendations into
            actionable decisions.
          </p>

        </div>

        <div className="growth-control-actions">

          <div className="growth-run-status">
            {analysis
              ? "Analysis available"
              : "Analysis required"}
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={
              handleGenerateAnalysis
            }
            disabled={
              analysisLoading
            }
          >
            {analysisLoading
              ? "Analyzing..."
              : analysis
              ? "Run New Analysis"
              : "Run AI Analysis"}
          </button>

        </div>

      </section>

      {/* ASSESSMENT */}

      <div className="agent-grid">

        <BusinessHealthCard
          health={health}
          metrics={metrics}
        />

        <DiagnosisCard
          diagnosis={diagnosis}
          health={health}
        />

      </div>

      {/* RECOMMENDATIONS */}

      <RecommendationList
        recommendations={
          recommendations
        }

        analysisId={
          analysis?._id
        }

        onCreateAction={
          handleCreateRecommendationAction
        }

        creatingRecommendationId={
          creatingRecommendationId
        }

        createdRecommendationIds={
          createdRecommendationIds
        }
      />

      {/* PENDING ACTIONS */}

      <PendingActions
        actions={
          pendingActions
        }

        loading={
          actionLoading
        }

        onApprove={
          handleApprove
        }

        onReject={
          handleReject
        }

        onExecute={
          handleExecute
        }
      />

      {/* HISTORY */}

      <ActionHistory
        actions={
          history
        }
      />

    </div>
  );
}

export default GrowthAgent;