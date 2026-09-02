import { useEffect, useState } from "react";

import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";

import api from "../services/api";

function Settings({ merchant }) {
  const [agentEnabled, setAgentEnabled] =
    useState(true);

  const [approvalRequired, setApprovalRequired] =
    useState(true);

  const [maxDiscountPercentage, setMaxDiscountPercentage] =
    useState(10);

  const [maxCampaignBudget, setMaxCampaignBudget] =
    useState(5000);

  const [allowAutomaticCampaigns, setAllowAutomaticCampaigns] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  const merchantName =
    merchant?.businessName ||
    merchant?.name ||
    merchant?.storeName ||
    "NovaTech Store";

  const merchantEmail =
    merchant?.email ||
    "demo@merchantos.com";

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/merchants/profile"
        );

      const currentMerchant =
        response?.data?.merchant;

      const settings =
        currentMerchant?.growthSettings ||
        {};

      setApprovalRequired(
        settings
          .requireApprovalForFinancialActions ??
          true
      );

      setMaxDiscountPercentage(
        settings
          .maxDiscountPercentage ??
          10
      );

      setMaxCampaignBudget(
        settings
          .maxCampaignBudget ??
          5000
      );

      setAllowAutomaticCampaigns(
        settings
          .allowAutomaticCampaigns ??
          false
      );

      setAgentEnabled(true);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response =
        await api.patch(
          "/merchants/settings",
          {
            maxDiscountPercentage:
              Number(
                maxDiscountPercentage
              ),

            maxCampaignBudget:
              Number(
                maxCampaignBudget
              ),

            requireApprovalForFinancialActions:
              approvalRequired,

            allowAutomaticCampaigns:
              allowAutomaticCampaigns,
          }
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to save settings"
        );
      }

      if (
        response.data?.merchant
          ?.growthSettings
      ) {
        const settings =
          response.data.merchant
            .growthSettings;

        setApprovalRequired(
          settings
            .requireApprovalForFinancialActions ??
            true
        );

        setMaxDiscountPercentage(
          settings
            .maxDiscountPercentage ??
            10
        );

        setMaxCampaignBudget(
          settings
            .maxCampaignBudget ??
            5000
        );

        setAllowAutomaticCampaigns(
          settings
            .allowAutomaticCampaigns ??
            false
        );

        localStorage.setItem(
          "merchant",
          JSON.stringify(
            response.data.merchant
          )
        );
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page module-page">

        <div className="page-heading">

          <span className="eyebrow">
            MERCHANT COMMAND CENTER
          </span>

          <h1>Settings</h1>

          <p>
            Configure your MerchantOS
            account and AI agent.
          </p>

        </div>

        <div className="page-card">

          <Loading
            message="Loading settings..."
          />

        </div>

      </div>
    );
  }

  return (
    <div className="page module-page">

      <div className="page-heading">

        <span className="eyebrow">
          MERCHANT COMMAND CENTER
        </span>

        <h1>Settings</h1>

        <p>
          Configure your MerchantOS
          account and AI agent.
        </p>

      </div>

      {saved && (
        <Alert
          type="success"
          message="Settings saved successfully."
          onClose={() =>
            setSaved(false)
          }
        />
      )}

      {error && (
        <Alert
          type="warning"
          message={error}
          onClose={() =>
            setError("")
          }
        />
      )}

      <div className="agent-grid">

        {/* MERCHANT ACCOUNT */}

        <div className="page-card">

          <div className="card-header">

            <div>

              <span className="section-label">
                MERCHANT ACCOUNT
              </span>

              <h2>
                Store Information
              </h2>

            </div>

          </div>

          <div className="form-group">

            <label className="form-label">
              Store Name
            </label>

            <input
              className="form-input"
              value={merchantName}
              readOnly
            />

          </div>

          <div className="form-group">

            <label className="form-label">
              Email
            </label>

            <input
              className="form-input"
              value={merchantEmail}
              readOnly
            />

          </div>

          <div className="form-group">

            <label className="form-label">
              Platform
            </label>

            <input
              className="form-input"
              value="MerchantOS"
              readOnly
            />

          </div>

        </div>

        {/* AI AGENT */}

        <div className="page-card">

          <div className="card-header">

            <div>

              <span className="section-label">
                AI AGENT
              </span>

              <h2>
                Agent Controls
              </h2>

            </div>

          </div>

          <div className="form-group">

            <label
              className="settings-toggle"
            >

              <span>

                <strong>
                  Enable Growth Agent
                </strong>

                <span className="settings-description">
                  Allow the AI agent to
                  identify growth
                  opportunities.
                </span>

              </span>

              <input
                type="checkbox"
                checked={agentEnabled}
                onChange={(event) =>
                  setAgentEnabled(
                    event.target.checked
                  )
                }
              />

            </label>

          </div>

          <div className="form-group">

            <label
              className="settings-toggle"
            >

              <span>

                <strong>
                  Require Approval
                </strong>

                <span className="settings-description">
                  Financial actions require
                  merchant approval before
                  execution.
                </span>

              </span>

              <input
                type="checkbox"
                checked={approvalRequired}
                onChange={(event) =>
                  setApprovalRequired(
                    event.target.checked
                  )
                }
              />

            </label>

          </div>

          <div className="form-group">

            <label className="form-label">
              Maximum Discount (%)
            </label>

            <input
              className="form-input"
              type="number"
              min="0"
              max="100"
              value={
                maxDiscountPercentage
              }
              onChange={(event) =>
                setMaxDiscountPercentage(
                  event.target.value
                )
              }
            />

          </div>

          <div className="form-group">

            <label className="form-label">
              Maximum Campaign Budget (₹)
            </label>

            <input
              className="form-input"
              type="number"
              min="0"
              value={
                maxCampaignBudget
              }
              onChange={(event) =>
                setMaxCampaignBudget(
                  event.target.value
                )
              }
            />

          </div>

          <div className="form-group">

            <label
              className="settings-toggle"
            >

              <span>

                <strong>
                  Allow Automatic Campaigns
                </strong>

                <span className="settings-description">
                  Allow the agent to execute
                  eligible campaigns
                  automatically.
                </span>

              </span>

              <input
                type="checkbox"
                checked={
                  allowAutomaticCampaigns
                }
                onChange={(event) =>
                  setAllowAutomaticCampaigns(
                    event.target.checked
                  )
                }
              />

            </label>

          </div>

          <button
            className="button button-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>

        </div>

      </div>

      {/* SYSTEM */}

      <div
        className="page-card"
        style={{
          marginTop: "24px",
        }}
      >

        <span className="section-label">
          SYSTEM
        </span>

        <h2
          style={{
            margin: "0 0 10px",
          }}
        >
          MerchantOS Status
        </h2>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          Your MerchantOS backend and AI
          Growth Agent are operational.
        </p>

        <div
          style={{
            marginTop: "18px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >

          <span className="status-dot" />

          System Operational

        </div>

      </div>

    </div>
  );
}

export default Settings;