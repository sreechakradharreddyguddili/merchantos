const ACTION_POLICIES = {
  payment_recovery: {
    risk: "HIGH",
    requiresApproval: true,
  },

  conversion_experiment: {
    risk: "HIGH",
    requiresApproval: true,
  },

  campaign: {
    risk: "HIGH",
    requiresApproval: true,
  },

  inventory_replenishment: {
    risk: "HIGH",
    requiresApproval: true,
  },

  cross_sell: {
    risk: "MEDIUM",
    requiresApproval: true,
  },
};

const evaluateActionPolicy = ({
  type,
  financialAction = false,
}) => {
  const policy =
    ACTION_POLICIES[type];

  if (!policy) {
    return {
      risk: "HIGH",
      requiresApproval: true,
      reason:
        "Unknown action type requires merchant approval.",
    };
  }

  if (financialAction) {
    return {
      risk: policy.risk,
      requiresApproval: true,
      reason:
        "Financial actions always require merchant approval.",
    };
  }

  return {
    risk: policy.risk,

    requiresApproval:
      policy.requiresApproval,

    reason:
      policy.requiresApproval
        ? "Merchant approval is required before execution."
        : "Action can be executed automatically.",
  };
};

module.exports = {
  ACTION_POLICIES,
  evaluateActionPolicy,
};