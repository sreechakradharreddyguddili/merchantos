export const ACTION_TYPES = {
  PAYMENT_RECOVERY: "payment_recovery",
  CONVERSION_EXPERIMENT: "conversion_experiment",
  CROSS_SELL: "cross_sell",
  CAMPAIGN: "campaign",
};

export const ACTION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  EXECUTING: "executing",
  COMPLETED: "completed",
  FAILED: "failed",
};

export const PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};

export const BUSINESS_HEALTH = {
  HEALTHY: "healthy",
  WARNING: "warning",
  CRITICAL: "critical",
  UNKNOWN: "unknown",
};

export const NAVIGATION_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
  },
  {
    id: "growth",
    label: "Growth Agent",
  },
  {
    id: "orders",
    label: "Orders",
  },
  {
    id: "products",
    label: "Products",
  },
  {
    id: "analytics",
    label: "Analytics",
  },
  {
    id: "settings",
    label: "Settings",
  },
];