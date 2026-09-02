import api from "./api";

export const generateAgentActions =
  async (
    analysisId,
    recommendationId = null
  ) => {
    if (!analysisId) {
      throw new Error(
        "Analysis ID is required"
      );
    }

    const body = {
      analysisId,
    };

    if (recommendationId) {
      body.recommendationId =
        recommendationId;
    }

    return api.post(
      "/agent-actions/generate",
      body
    );
  };

export const getPendingActions =
  async () => {
    return api.get(
      "/agent-actions/pending"
    );
  };

export const getAgentActionHistory =
  async () => {
    return api.get(
      "/agent-actions/history"
    );
  };

export const approveAgentAction =
  async (actionId) => {
    if (!actionId) {
      throw new Error(
        "Action ID is required"
      );
    }

    return api.patch(
      `/agent-actions/${actionId}/approve`
    );
  };

export const rejectAgentAction =
  async (
    actionId,
    reason = "Rejected by merchant"
  ) => {
    if (!actionId) {
      throw new Error(
        "Action ID is required"
      );
    }

    return api.patch(
      `/agent-actions/${actionId}/reject`,
      {
        reason,
      }
    );
  };

export const executeAgentAction =
  async (actionId) => {
    if (!actionId) {
      throw new Error(
        "Action ID is required"
      );
    }

    return api.patch(
      `/agent-actions/${actionId}/execute`
    );
  };