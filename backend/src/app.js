const express = require("express");
const cors = require("cors");

const merchantRoutes = require("./routes/merchantRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const agentRoutes = require("./routes/agentRoutes");
const growthAnalysisRoutes = require("./routes/growthAnalysisRoutes");
const agentActionRoutes = require("./routes/agentActionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiBuyerRoutes = require("./routes/aiBuyerRoutes");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// ==========================================
// BODY PARSERS — MUST COME BEFORE ROUTES
// ==========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// HEALTH
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MerchantOS Backend is running",
    service: "backend",
    database: "MongoDB",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/merchants",
  merchantRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/agent",
  agentRoutes
);

app.use(
  "/api/growth-analysis",
  growthAnalysisRoutes
);

app.use(
  "/api/agent-actions",
  agentActionRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/ai-buyer",
  aiBuyerRoutes
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Unhandled server error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
);

module.exports = app;