const AgentAction =
  require("../models/AgentAction");

const {
  executeAgentAction,
} = require(
  "../services/agentExecutionService"
);

// =========================================================
// AUDIT HELPER
// =========================================================

const appendAuditEvent = (
  action,
  {
    event,
    fromStatus = null,
    toStatus = null,
    actor,
    reason = "",
    metadata = null,
  }
) => {
  if (!Array.isArray(action.auditTrail)) {
    action.auditTrail = [];
  }

  action.auditTrail.push({
    event,
    fromStatus,
    toStatus,
    actor,
    reason,
    timestamp: new Date(),
    metadata,
  });
};

// =========================================================
// EXECUTE ACTION
// =========================================================

const executeAction =
  async (req, res) => {
    let action = null;

    try {
      action =
        await AgentAction.findOne({
          _id:
            req.params.id,

          merchant:
            req.merchantId,
        });

      if (!action) {
        return res.status(404).json({
          success: false,

          message:
            "Agent action not found",
        });
      }

      // =====================================================
      // PREVENT DUPLICATE EXECUTION
      // =====================================================

      if (
        action.status ===
        "completed"
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Agent action has already been completed",
        });
      }

      if (
        action.status ===
        "rejected"
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Rejected actions cannot be executed",
        });
      }

      if (
        action.status ===
        "executing"
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Agent action is already executing",
        });
      }

      // =====================================================
      // APPROVAL GATE
      // =====================================================

      /*
       * Every action must be approved
       * before execution.
       */

      if (
        action.status !==
        "approved"
      ) {
        return res.status(403).json({
          success: false,

          message:
            "Merchant approval is required before executing this action",

          data: {
            status:
              action.status,

            requiresApproval:
              true,
          },
        });
      }

      // =====================================================
      // EXECUTION START
      // =====================================================

      const previousStatus =
        action.status;

      action.status =
        "executing";

      appendAuditEvent(
        action,
        {
          event:
            "execution_started",

          fromStatus:
            previousStatus,

          toStatus:
            "executing",

          actor:
            "system",

          reason:
            "Approved agent action entered execution.",

          metadata: {
            actionType:
              action.type,

            merchantId:
              String(
                req.merchantId
              ),

            estimatedImpact:
              action.estimatedImpact,

            financialAction:
              action.financialAction,

            requiresApproval:
              action.requiresApproval,
          },
        }
      );

      await action.save();

      // =====================================================
      // EXECUTE
      // =====================================================

      const executedAction =
        await executeAgentAction(
          action
        );

      // =====================================================
      // COMPLETION AUDIT
      // =====================================================

      /*
       * executeAgentAction() already updates
       * the action to completed and persists it.
       *
       * Reload the document so that we append
       * the audit event to the latest state.
       */

      const completedAction =
        await AgentAction.findOne({
          _id:
            action._id,

          merchant:
            req.merchantId,
        });

      if (completedAction) {
        appendAuditEvent(
          completedAction,
          {
            event:
              "completed",

            fromStatus:
              "executing",

            toStatus:
              "completed",

            actor:
              "system",

            reason:
              "Agent action executed successfully.",

            metadata: {
              actionType:
                completedAction.type,

              executionResult:
                completedAction
                  .executionResult ||
                null,
            },
          }
        );

        await completedAction.save();
      }

      return res.status(200).json({
        success: true,

        message:
          "Agent action executed successfully",

        data: {
          action:
            completedAction ||
            executedAction,
        },
      });
    } catch (error) {
      console.error(
        "Agent execution error:",
        error
      );

      // =====================================================
      // FAILURE AUDIT
      // =====================================================

      try {
        if (action?._id) {
          const failedAction =
            await AgentAction.findOne({
              _id:
                action._id,

              merchant:
                req.merchantId,
            });

          if (failedAction) {
            const currentStatus =
              failedAction.status;

            /*
             * The execution service is responsible
             * for marking the action as failed.
             * We only append the audit event here.
             */

            appendAuditEvent(
              failedAction,
              {
                event:
                  "failed",

                fromStatus:
                  currentStatus ===
                  "failed"
                    ? "executing"
                    : currentStatus,

                toStatus:
                  "failed",

                actor:
                  "system",

                reason:
                  error.message ||
                  "Agent action execution failed.",

                metadata: {
                  actionType:
                    failedAction.type,

                  error:
                    error.message,

                  executionResult:
                    failedAction
                      .executionResult ||
                    null,
                },
              }
            );

            await failedAction.save();
          }
        }
      } catch (auditError) {
        console.error(
          "Failed to record execution audit event:",
          auditError
        );
      }

      return res.status(500).json({
        success: false,

        message:
          "Agent action execution failed",

        error:
          error.message,
      });
    }
  };

// =========================================================
// EXPORT
// =========================================================

module.exports = {
  executeAction,
};