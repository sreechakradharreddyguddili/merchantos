import { useEffect, useState } from "react";

import BusinessHealth from "../components/dashboard/BusinessHealth";
import ActionStats from "../components/dashboard/ActionStats";
import LatestIntelligence from "../components/dashboard/LatestIntelligence";
import PendingActions from "../components/dashboard/PendingActions";

import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";

import {
  getLatestGrowthAnalysis,
} from "../services/growthAnalysisService";

import {
  getPendingActions,
  getAgentActionHistory,
} from "../services/agentActionService";

function Dashboard({
  merchant,
  setCurrentPage,
}) {
  const [analysis, setAnalysis] =
    useState(null);

  const [pendingActions, setPendingActions] =
    useState([]);

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
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

      const rawAnalysis =
        analysisResponse?.data?.analysis ||
        null;

      setAnalysis(
        normalizeAnalysis(rawAnalysis)
      );

      setPendingActions(
        Array.isArray(
          pendingResponse?.data?.actions
        )
          ? pendingResponse.data.actions
          : []
      );

      setHistory(
        Array.isArray(
          historyResponse?.data?.actions
        )
          ? historyResponse.data.actions
          : []
      );
    } catch (err) {
      console.error(
        "Dashboard load error:",
        err
      );

      setError(
        err.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading
        message="Loading MerchantOS..."
      />
    );
  }

  const totalActions =
    pendingActions.length +
    history.length;

  const completedActions =
    history.filter(
      (action) =>
        action?.status ===
        "completed"
    ).length;

  const rejectedActions =
    history.filter(
      (action) =>
        action?.status ===
        "rejected"
    ).length;

  const health =
    analysis?.businessHealth ||
    analysis?.diagnosis
      ?.business_health ||
    "not analyzed";

  return (
    <div className="page">

      <Alert
        message={error}
        onClose={() =>
          setError("")
        }
      />

      {/* PAGE HEADER */}

      <div className="page-heading">

        <div>

          <span className="eyebrow">
            MERCHANT COMMAND CENTER
          </span>

          <h1>
            Good morning,{" "}
            {merchant?.businessName ||
              merchant?.name ||
              "NovaTech Store"}
          </h1>

          <p>
            Your AI-powered commerce
            intelligence at a glance.
          </p>

        </div>

      </div>

      {/* HERO */}

      <div className="dashboard-grid">

        <BusinessHealth
          health={health}
        />

        <div className="agent-summary-card">

          <span className="section-label">
            AI GROWTH AGENT
          </span>

          <h2>
            {pendingActions.length}{" "}
            Actions Waiting
          </h2>

          <p>
            Your agent is continuously
            looking for growth
            opportunities.
          </p>

          <button
            type="button"
            className="button button-primary"
            onClick={() =>
              setCurrentPage("growth")
            }
          >
            Open Growth Agent →
          </button>

        </div>

      </div>

      {/* ACTION STATISTICS */}

      <ActionStats
        total={totalActions}
        pending={
          pendingActions.length
        }
        completed={
          completedActions
        }
        rejected={
          rejectedActions
        }
      />

      {/* LATEST INTELLIGENCE + QUEUE */}

      <div className="dashboard-grid">

        <LatestIntelligence
          analysis={analysis}
          onViewDetails={() =>
            setCurrentPage("growth")
          }
        />

        <PendingActions
          actions={
            pendingActions
          }
        />

      </div>

    </div>
  );
}

/*
 * Normalize the GrowthAnalysis document
 * so Dashboard components receive one
 * predictable data structure.
 *
 * Backend stores:
 *
 * analysis.overview
 *
 * while some dashboard components
 * expect:
 *
 * analysis.metrics
 */
function normalizeAnalysis(
  rawAnalysis
) {
  if (!rawAnalysis) {
    return null;
  }

  const overview =
    rawAnalysis.overview ||
    {};

  const existingMetrics =
    rawAnalysis.metrics ||
    {};

  const metrics = {
    revenue:
      overview.revenue ??
      existingMetrics.revenue ??
      0,

    totalOrders:
      overview.totalOrders ??
      overview.total_orders ??
      existingMetrics.totalOrders ??
      existingMetrics.total_orders ??
      0,

    paidOrders:
      overview.paidOrders ??
      overview.paid_orders ??
      existingMetrics.paidOrders ??
      existingMetrics.paid_orders ??
      0,

    failedPayments:
      overview.failedPayments ??
      overview.failed_payments ??
      existingMetrics.failedPayments ??
      existingMetrics.failed_payments ??
      0,

    averageOrderValue:
      overview.averageOrderValue ??
      overview.average_order_value ??
      existingMetrics.averageOrderValue ??
      existingMetrics.average_order_value ??
      0,

    paymentSuccessRate:
      overview.paymentSuccessRate ??
      overview.payment_success_rate ??
      existingMetrics.paymentSuccessRate ??
      existingMetrics.payment_success_rate ??
      0,
  };

  return {
    ...rawAnalysis,

    metrics,

    overview: {
      ...overview,

      revenue:
        metrics.revenue,

      totalOrders:
        metrics.totalOrders,

      paidOrders:
        metrics.paidOrders,

      failedPayments:
        metrics.failedPayments,

      averageOrderValue:
        metrics.averageOrderValue,

      paymentSuccessRate:
        metrics.paymentSuccessRate,
    },
  };
}

export default Dashboard;