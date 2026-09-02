const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.3",

  info: {
    title: "MerchantOS API",
    version: "1.0.0",
    description:
      "MerchantOS AI Commerce OS API documentation covering merchant management, products, orders, payments, analytics, Growth Agent and AI Buyer workflows.",
  },

  servers: [
    {
      url: "/",
      description: "Current MerchantOS server",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  tags: [
    { name: "Health", description: "System health" },
    { name: "Merchants", description: "Merchant authentication and settings" },
    { name: "Products", description: "Product management" },
    { name: "Orders", description: "Order management" },
    { name: "Payments", description: "Payment operations" },
    { name: "Analytics", description: "Merchant analytics" },
    { name: "Growth Agent", description: "AI Growth Agent operations" },
    { name: "Agent Actions", description: "Agent action lifecycle" },
    { name: "Growth Analysis", description: "Growth analysis history and results" },
    { name: "Dashboard", description: "Merchant dashboard" },
    { name: "AI Buyer", description: "AI Buyer commerce workflow" },
  ],

  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Check backend health",
        responses: {
          200: {
            description: "Backend health status",
          },
        },
      },
    },

    "/api/merchants/register": {
      post: {
        tags: ["Merchants"],
        summary: "Register a merchant",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                  businessName: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Merchant registered" },
          400: { description: "Invalid request" },
        },
      },
    },

    "/api/merchants/login": {
      post: {
        tags: ["Merchants"],
        summary: "Login merchant",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid credentials" },
        },
      },
    },

    "/api/merchants/profile": {
      get: {
        tags: ["Merchants"],
        security: [{ bearerAuth: [] }],
        summary: "Get merchant profile",
        responses: {
          200: { description: "Merchant profile" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/merchants/settings": {
      patch: {
        tags: ["Merchants"],
        security: [{ bearerAuth: [] }],
        summary: "Update merchant settings",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          200: { description: "Settings updated" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/products": {
      get: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        summary: "Get products",
        responses: {
          200: { description: "Product list" },
          401: { description: "Unauthorized" },
        },
      },

      post: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        summary: "Create product",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          201: { description: "Product created" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/products/ai/catalog": {
      get: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        summary: "Get AI product catalog",
        responses: {
          200: { description: "AI product catalog" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        summary: "Get product by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Product details" },
          401: { description: "Unauthorized" },
          404: { description: "Product not found" },
        },
      },

      put: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        summary: "Update product",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          200: { description: "Product updated" },
          401: { description: "Unauthorized" },
        },
      },

      delete: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        summary: "Delete product",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Product deleted" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/orders": {
      get: {
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        summary: "Get merchant orders",
        responses: {
          200: { description: "Order list" },
          401: { description: "Unauthorized" },
        },
      },

      post: {
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        summary: "Create order",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          201: { description: "Order created" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/orders/{id}": {
      get: {
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        summary: "Get order by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Order details" },
          401: { description: "Unauthorized" },
          404: { description: "Order not found" },
        },
      },
    },

    "/api/orders/{id}/payment": {
      patch: {
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        summary: "Update order payment status",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          200: { description: "Payment status updated" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/payments/create-order": {
      post: {
        tags: ["Payments"],
        security: [{ bearerAuth: [] }],
        summary: "Create payment order",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          200: { description: "Payment order created" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/payments/verify": {
      post: {
        tags: ["Payments"],
        security: [{ bearerAuth: [] }],
        summary: "Verify payment",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          200: { description: "Payment verified" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/analytics/overview": {
      get: {
        tags: ["Analytics"],
        security: [{ bearerAuth: [] }],
        summary: "Get analytics overview",
        responses: {
          200: { description: "Analytics overview" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/analytics/revenue-trend": {
      get: {
        tags: ["Analytics"],
        security: [{ bearerAuth: [] }],
        summary: "Get revenue trend",
        responses: {
          200: { description: "Revenue trend" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/analytics/product-performance": {
      get: {
        tags: ["Analytics"],
        security: [{ bearerAuth: [] }],
        summary: "Get product performance",
        responses: {
          200: { description: "Product performance" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/analytics/payment-analytics": {
      get: {
        tags: ["Analytics"],
        security: [{ bearerAuth: [] }],
        summary: "Get payment analytics",
        responses: {
          200: { description: "Payment analytics" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/analytics/ai-buyer": {
      get: {
        tags: ["Analytics"],
        security: [{ bearerAuth: [] }],
        summary: "Get AI Buyer analytics",
        responses: {
          200: { description: "AI Buyer analytics" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/agent/health": {
      get: {
        tags: ["Growth Agent"],
        security: [{ bearerAuth: [] }],
        summary: "Get Growth Agent health",
        responses: {
          200: { description: "Agent health" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/agent/analyze": {
      post: {
        tags: ["Growth Agent"],
        security: [{ bearerAuth: [] }],
        summary: "Run Growth Agent analysis",
        responses: {
          200: { description: "Growth analysis generated" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/agent-actions/generate": {
      post: {
        tags: ["Agent Actions"],
        security: [{ bearerAuth: [] }],
        summary: "Generate agent actions",
        responses: {
          200: { description: "Actions generated" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/agent-actions/pending": {
      get: {
        tags: ["Agent Actions"],
        security: [{ bearerAuth: [] }],
        summary: "Get pending agent actions",
        responses: {
          200: { description: "Pending actions" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/agent-actions/history": {
      get: {
        tags: ["Agent Actions"],
        security: [{ bearerAuth: [] }],
        summary: "Get action history",
        responses: {
          200: { description: "Action history" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/agent-actions/{id}/approve": {
      patch: {
        tags: ["Agent Actions"],
        security: [{ bearerAuth: [] }],
        summary: "Approve agent action",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Action approved" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/agent-actions/{id}/reject": {
      patch: {
        tags: ["Agent Actions"],
        security: [{ bearerAuth: [] }],
        summary: "Reject agent action",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Action rejected" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/agent-actions/{id}/execute": {
      patch: {
        tags: ["Agent Actions"],
        security: [{ bearerAuth: [] }],
        summary: "Execute agent action",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Action executed" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/growth-analysis/history": {
      get: {
        tags: ["Growth Analysis"],
        security: [{ bearerAuth: [] }],
        summary: "Get growth analysis history",
        responses: {
          200: { description: "Growth analysis history" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/growth-analysis/latest": {
      get: {
        tags: ["Growth Analysis"],
        security: [{ bearerAuth: [] }],
        summary: "Get latest growth analysis",
        responses: {
          200: { description: "Latest growth analysis" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/dashboard": {
      get: {
        tags: ["Dashboard"],
        security: [{ bearerAuth: [] }],
        summary: "Get merchant dashboard",
        responses: {
          200: { description: "Dashboard data" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/ai-buyer/recommend": {
      post: {
        tags: ["AI Buyer"],
        summary: "Get AI Buyer product recommendations",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          200: { description: "Product recommendations" },
        },
      },
    },

    "/api/ai-buyer/catalog": {
      get: {
        tags: ["AI Buyer"],
        summary: "Get AI Buyer catalog",
        responses: {
          200: { description: "Product catalog" },
        },
      },
    },

    "/api/ai-buyer/order": {
      post: {
        tags: ["AI Buyer"],
        summary: "Create AI Buyer order",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          201: { description: "AI Buyer order created" },
        },
      },
    },

    "/api/ai-buyer/payment": {
      post: {
        tags: ["AI Buyer"],
        summary: "Create AI Buyer payment order",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          200: { description: "Payment order created" },
        },
      },
    },

    "/api/ai-buyer/verify": {
      post: {
        tags: ["AI Buyer"],
        summary: "Verify AI Buyer payment",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          200: { description: "Payment verified" },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [],
});

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/api-docs.json", (req, res) => {
    res.json(swaggerSpec);
  });
};

module.exports = setupSwagger;

