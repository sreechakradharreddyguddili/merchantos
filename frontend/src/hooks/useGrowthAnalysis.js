import { useCallback, useEffect, useState } from "react";

import {
  getLatestGrowthAnalysis,
  getGrowthAnalysisHistory,
  generateGrowthAnalysis,
} from "../services/growthAnalysisService";

function useGrowthAnalysis({
  autoLoad = true,
} = {}) {
  const [analysis, setAnalysis] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadLatestAnalysis =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getLatestGrowthAnalysis();

        setAnalysis(
          response?.data?.analysis || null
        );

        return response;
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Failed to load growth analysis"
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
          await getGrowthAnalysisHistory();

        setHistory(
          response?.data?.analyses || []
        );

        return response;
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Failed to load analysis history"
        );

        return null;
      }
    }, []);

  const generateAnalysis =
    useCallback(async () => {
      try {
        setGenerating(true);
        setError("");

        const response =
          await generateGrowthAnalysis();

        if (
          response?.data?.analysis
        ) {
          setAnalysis(
            response.data.analysis
          );
        }

        return response;
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Failed to generate growth analysis"
        );

        throw err;
      } finally {
        setGenerating(false);
      }
    }, []);

  const refresh =
    useCallback(async () => {
      await Promise.all([
        loadLatestAnalysis(),
        loadHistory(),
      ]);
    }, [
      loadLatestAnalysis,
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
    analysis,
    history,
    loading,
    generating,
    error,

    loadLatestAnalysis,
    loadHistory,
    generateAnalysis,
    refresh,

    clearError,
  };
}

export default useGrowthAnalysis;