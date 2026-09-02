import { useCallback, useEffect, useState } from "react";

import {
  generateAgentActions,
  getPendingActions,
  getAgentActionHistory,
  approveAgentAction,
  rejectAgentAction,
  executeAgentAction,
} from "../services/agentActionService";

function useAgentActions({
  autoLoad = true,
} = {}) {
  const [pendingActions, setPendingActions] =
    useState([]);

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [processingId, setProcessingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const loadPendingActions =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getPendingActions();

        setPendingActions(
          response?.data?.actions || []
        );

        return response;
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Failed to load pending actions"
        );

        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  const loadHistory =
    useCallback(async () => {
      try {
        setError("");

        const response =
          await getAgentActionHistory();

        setHistory(
          response?.data?.actions || []
        );

        return response;
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Failed to load action history"
        );

        return null;
      }
    }, []);

  const generateActions =
    useCallback(async (analysisId) => {
      try {
        setError("");

        const response =
          await generateAgentActions(
            analysisId
          );

        await loadPendingActions();

        return response;
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Failed to generate agent actions"
        );

        throw err;
      }
    }, [loadPendingActions]);

  const approveAction =
    useCallback(async (actionId) => {
      try {
        setProcessingId(actionId);
        setError("");

        const response =
          await approveAgentAction(
            actionId
          );

        await Promise.all([
          loadPendingActions(),
          loadHistory(),
        ]);

        return response;
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Failed to approve action"
        );

        throw err;
      } finally {
        setProcessingId(null);
      }
    }, [
      loadPendingActions,
      loadHistory,
    ]);

  const rejectAction =
    useCallback(async (
      actionId,
      reason
    ) => {
      try {
        setProcessingId(actionId);
        setError("");

        const response =
          await rejectAgentAction(
            actionId,
            reason
          );

        await Promise.all([
          loadPendingActions(),
          loadHistory(),
        ]);

        return response;
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Failed to reject action"
        );

        throw err;
      } finally {
        setProcessingId(null);
      }
    }, [
      loadPendingActions,
      loadHistory,
    ]);

  const executeAction =
    useCallback(async (actionId) => {
      try {
        setProcessingId(actionId);
        setError("");

        const response =
          await executeAgentAction(
            actionId
          );

        await Promise.all([
          loadPendingActions(),
          loadHistory(),
        ]);

        return response;
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Failed to execute action"
        );

        throw err;
      } finally {
        setProcessingId(null);
      }
    }, [
      loadPendingActions,
      loadHistory,
    ]);

  const refresh =
    useCallback(async () => {
      await Promise.all([
        loadPendingActions(),
        loadHistory(),
      ]);
    }, [
      loadPendingActions,
      loadHistory,
    ]);

  const clearError = () => {
    setError("");
  };

  useEffect(() => {
    if (autoLoad) {
      refresh();
    }
  }, [autoLoad, refresh]);

  return {
    pendingActions,
    history,

    loading,
    processingId,
    error,

    loadPendingActions,
    loadHistory,

    generateActions,
    approveAction,
    rejectAction,
    executeAction,

    refresh,
    clearError,
  };
}

export default useAgentActions;