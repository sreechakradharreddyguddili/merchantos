cd C:\MerchantOS

@'
# MerchantOS

## AI-Powered Agentic Commerce Platform

MerchantOS is an AI-powered commerce operating system designed to help merchants increase revenue through intelligent recommendations, agentic growth actions, buyer intent analysis, analytics, and governed payment workflows.

The platform connects merchant intelligence and buyer intelligence into a closed-loop commerce system.

---

# Core Idea

MerchantOS creates a continuous revenue-growth loop:

~~~text
┌─────────────────────┐
│    Merchant Data    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│     AI Analysis     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Revenue Opportunity │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ AI Recommendation   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Risk & Policy       │
│ Evaluation          │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Merchant Approval   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Agent Execution     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Business Outcome    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│     Analytics       │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Next Recommendation │
└─────────────────────┘
~~~

The AI Buyer creates the transaction loop:

~~~text
┌─────────────────────┐
│    Buyer Intent     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│      AI Buyer       │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Product Recommend.  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    Cross-Selling    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Order Creation    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│      Razorpay       │
│      Payment        │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Payment Verification│
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│      Revenue        │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Merchant Analytics  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    Growth Agent     │
└─────────────────────┘
~~~

---

# Features

## AI Growth Agent

The Growth Agent analyzes merchant business data and identifies revenue opportunities such as:

- Conversion improvement
- Payment recovery
- Cross-selling
- Inventory replenishment
- Campaign opportunities
- AI Buyer growth opportunities

The agent does not blindly execute financial actions.

Every action can pass through:

~~~text
┌──────────────────────┐
│   Recommendation     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Risk Evaluation    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Policy Decision    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Merchant Approval    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│     Execution        │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    Audit Trail       │
└──────────────────────┘
~~~

---

## AI Buyer

The AI Buyer helps customers discover relevant products based on buyer intent.

Capabilities include:

- Product catalog discovery
- AI-powered recommendations
- Cross-sell suggestions
- Buyer intent processing
- AI-assisted order creation
- Razorpay payment integration
- Server-side payment verification

---

## Agent Safety & Governance

MerchantOS provides controlled agentic execution with:

- Risk assessment
- Approval requirements
- Policy decisions
- Decision reasons
- Supporting evidence
- Expected outcomes
- Estimated impact
- Source channel
- Audit events
- Execution results
- Failure recovery information

### Successful lifecycle

~~~text
┌────────────────────────┐
│ Recommendation Created │
└────────────┬───────────┘
             ↓
┌────────────────────────┐
│    Pending Approval    │
└────────────┬───────────┘
             ↓
┌────────────────────────┐
│       Approved         │
└────────────┬───────────┘
             ↓
┌────────────────────────┐
│   Execution Started    │
└────────────┬───────────┘
             ↓
┌────────────────────────┐
│       Completed        │
└────────────────────────┘
~~~

### Failure lifecycle

~~~text
┌────────────────────────┐
│   Execution Started    │
└────────────┬───────────┘
             ↓
┌────────────────────────┐
│        Failed          │
└────────────┬───────────┘
             ↓
┌────────────────────────┐
│     Failure Reason     │
└────────────┬───────────┘
             ↓
┌────────────────────────┐
│   Recovery Strategy    │
└────────────┬───────────┘
             ↓
┌────────────────────────┐
│       Next Step        │
└────────────────────────┘
~~~

---

# Razorpay Integration

Razorpay is used as the payment layer for MerchantOS.

~~~text
┌─────────────────────┐
│      AI Buyer       │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Product Selection   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Order Creation    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│      Razorpay       │
│      Payment        │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Server Verification │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Order / Payment     │
│      Update         │
└─────────────────────┘
~~~

---

# Merchant Operations

MerchantOS provides the following modules:

### Dashboard

Business health, revenue intelligence, latest insights, and pending actions.

### Growth Agent

Business diagnosis, AI recommendations, governed actions, approvals, execution, and audit history.

### AI Buyer

Buyer-facing product discovery and AI recommendations.

### Orders

Customer orders, payment status, order status, and order creation.

### Products

Product and inventory management.

### Analytics

Business performance and commerce analytics.

### Settings

Merchant configuration and agent settings.

---

# System Architecture

~~~text
                           ┌────────────────────────┐
                           │       MERCHANTOS       │
                           └────────────┬───────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
                    ▼                                       ▼
          ┌──────────────────┐                    ┌──────────────────┐
          │  React Frontend  │                    │  AI Intelligence │
          │  React + Vite    │                    │     FastAPI      │
          │     Nginx        │                    └────────┬─────────┘
          └────────┬─────────┘                             │
                   │                                       ├──────────────┐
                   ↓                                       ↓              ↓
          ┌──────────────────┐                    ┌──────────────┐ ┌──────────────┐
          │ Node.js Backend  │                    │ Growth Agent │ │   AI Buyer   │
          │    Express.js    │                    └──────┬───────┘ └──────┬───────┘
          └────────┬─────────┘                           │                │
                   │                                    └────────┬───────┘
        ┌──────────┼──────────┐                                │
        │          │          │                                ▼
        ▼          ▼          ▼                         ┌──────────────┐
   ┌─────────┐ ┌─────────┐ ┌───────────┐               │   Groq / LLM │
   │Products │ │ Orders  │ │ Analytics │               └──────────────┘
   └────┬────┘ └────┬────┘ └─────┬─────┘
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ MongoDB Atlas │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   Razorpay   │
              └──────────────┘
~~~

---

# Agentic Commerce Architecture

Merchant intelligence and buyer intelligence work together.

~~~text
                    MERCHANT SIDE
                         │
                         ▼
                 ┌───────────────┐
                 │ Merchant Data │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │ Growth Agent  │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │ Opportunity   │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │ Recommendation│
                 └───────┬───────┘
                         ↓
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
     ┌────────────────┐    ┌────────────────┐
     │ Evidence       │    │ Risk Evaluation│
     └───────┬────────┘    └───────┬────────┘
             │                     │
             └──────────┬──────────┘
                        ↓
               ┌─────────────────┐
               │ Policy Decision │
               └────────┬────────┘
                        ↓
               ┌─────────────────┐
               │Merchant Approval│
               └────────┬────────┘
                        ↓
               ┌─────────────────┐
               │ Agent Execution │
               └────────┬────────┘
                        ↓
               ┌─────────────────┐
               │ Business Outcome│
               └────────┬────────┘
                        ↓
                  ┌────────────┐
                  │ Analytics  │
                  └─────┬──────┘
                        │
                        └───────────────► Next Recommendation


                      BUYER SIDE
                          │
                          ▼
                  ┌──────────────┐
                  │  Buyer Intent│
                  └──────┬───────┘
                         ↓
                  ┌──────────────┐
                  │    AI Buyer  │
                  └──────┬───────┘
                         ↓
                  ┌──────────────┐
                  │ Recommendation│
                  └──────┬───────┘
                         ↓
                  ┌──────────────┐
                  │  Cross-Sell  │
                  └──────┬───────┘
                         ↓
                  ┌──────────────┐
                  │ Order Create │
                  └──────┬───────┘
                         ↓
                  ┌──────────────┐
                  │   Razorpay   │
                  └──────┬───────┘
                         ↓
                  ┌──────────────┐
                  │   Revenue    │
                  └──────┬───────┘
                         ↓
                  ┌──────────────┐
                  │   Analytics  │
                  └──────────────┘
~~~

---

# End-to-End Data Flow

~~~text
┌──────────────────────┐
│ Customer / Merchant  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   React Frontend     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Node.js / Express    │
│      Backend         │
└──────────┬───────────┘
           │
      ┌────┼───────────────┐
      │    │               │
      ▼    ▼               ▼
┌────────┐ ┌────────┐ ┌────────────┐
│Products│ │ Orders │ │ Analytics  │
└────┬───┘ └────┬───┘ └─────┬──────┘
     │           │           │
     └───────────┼───────────┘
                 ↓
        ┌─────────────────┐
        │  MongoDB Atlas  │
        └────────┬────────┘
                 ↓
        ┌─────────────────┐
        │   AI Service    │
        │     FastAPI     │
        └────────┬────────┘
                 │
           ┌─────┴──────┐
           ▼            ▼
   ┌──────────────┐ ┌──────────────┐
   │ Growth Agent │ │   AI Buyer   │
   └──────┬───────┘ └──────┬───────┘
          │                │
          ▼                ▼
 ┌────────────────┐ ┌────────────────┐
 │ Recommendations│ │ Buyer Intent   │
 └───────┬────────┘ └───────┬────────┘
         │                  │
         ▼                  ▼
 ┌────────────────┐ ┌────────────────┐
 │ Policy + Risk  │ │   Order        │
 └───────┬────────┘ └───────┬────────┘
         │                  │
         ▼                  ▼
 ┌────────────────┐ ┌────────────────┐
 │    Approval    │ │    Razorpay    │
 └───────┬────────┘ └───────┬────────┘
         │                  │
         ▼                  ▼
 ┌────────────────┐ ┌────────────────┐
 │    Execution   │ │Payment Verify  │
 └───────┬────────┘ └───────┬────────┘
         │                  │
         └──────────┬───────┘
                    ↓
             ┌──────────────┐
             │ Business Data│
             └───────┬──────┘
                     ↓
               ┌───────────┐
               │ Analytics │
               └─────┬─────┘
                     ↓
              ┌──────────────┐
              │ Next AI      │
              │ Decision     │
              └──────────────┘
~~~

---

# Docker Architecture

MerchantOS is containerized into three application services.

~~~text
┌─────────────────────────────────────────────────────────────┐
│                       DOCKER COMPOSE                        │
│                                                             │
│  ┌────────────────┐       ┌────────────────────────────┐   │
│  │    Frontend    │       │          Backend           │   │
│  │                │       │                            │   │
│  │ React + Vite   │──────▶│ Node.js + Express          │   │
│  │ Nginx          │       │ Port 5000                  │   │
│  │ Port 80        │       │                            │   │
│  └────────────────┘       └──────────────┬─────────────┘   │
│                                          │                 │
│                                          ▼                 │
│                           ┌────────────────────────────┐   │
│                           │        AI Service           │   │
│                           │                            │   │
│                           │ Python + FastAPI            │   │
│                           │ Port 8000                  │   │
│                           └──────────────┬─────────────┘   │
└──────────────────────────────────────────┼─────────────────┘
                                           │
                              ┌────────────┴────────────┐
                              ▼                         ▼
                       ┌──────────────┐          ┌────────────┐
                       │ MongoDB Atlas│          │    Groq    │
                       └──────────────┘          └────────────┘
~~~

---

# Technology Stack

## Frontend

- React
- Vite
- JavaScript
- CSS
- Nginx

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Axios
- Razorpay SDK
- Redis client

## AI Service

- Python
- FastAPI
- LangChain
- LangGraph
- Groq
- LLMs
- PyMongo
- Pydantic
- XGBoost
- Scikit-learn
- NumPy
- Pandas

## Database

- MongoDB
- MongoDB Atlas

## Payments

- Razorpay

## DevOps

- Git
- GitHub
- Docker
- Docker Compose

## Extended Infrastructure

- AWS
- Kubernetes
- Terraform
- GitHub Actions
- Prometheus
- Grafana

---

# Project Structure

~~~text
merchantos/
│
├── ai-service/
│   ├── app/
│   │   ├── agents/
│   │   ├── models/
│   │   ├── services/
│   │   ├── tools/
│   │   ├── utils/
│   │   ├── config.py
│   │   ├── main.py
│   │   └── routes.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
│
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
~~~

---

# Prerequisites

Install:

- Node.js 22+
- Python 3.13+
- Docker Desktop
- Git
- MongoDB or MongoDB Atlas

---

# Environment Variables

Never commit `.env` files or secrets to GitHub.

## Backend

~~~env
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
AI_SERVICE_URL=http://localhost:8000
~~~

## AI Service

~~~env
MONGODB_URI=<your-mongodb-uri>
AI_SERVICE_HOST=0.0.0.0
AI_SERVICE_PORT=8000
GROQ_API_KEY=<your-groq-api-key>
LLM_MODEL=openai/gpt-oss-120b
~~~

## Frontend

~~~env
VITE_API_BASE_URL=http://localhost:5000/api
~~~

---

# Run with Docker

From the project root:

~~~bash
docker compose up -d --build
~~~

Check containers:

~~~bash
docker compose ps
~~~

View backend logs:

~~~bash
docker compose logs --tail=50 backend
~~~

View AI service logs:

~~~bash
docker compose logs --tail=50 ai-service
~~~

View frontend logs:

~~~bash
docker compose logs --tail=50 frontend
~~~

Stop the application:

~~~bash
docker compose down
~~~

---

# Local URLs

Frontend:

~~~text
http://localhost
~~~

Backend:

~~~text
http://localhost:5000
~~~

Backend health:

~~~text
http://localhost:5000/api/health
~~~

AI Service:

~~~text
http://localhost:8000
~~~

AI Service health:

~~~text
http://localhost:8000/api/health
~~~

---

# API Overview

## Merchant APIs

~~~text
/api/merchants
~~~

## Product APIs

~~~text
/api/products
~~~

## Order APIs

~~~text
/api/orders
~~~

## Analytics APIs

~~~text
/api/analytics
~~~

## Growth Agent APIs

~~~text
/api/agent
/api/agent-actions
/api/growth-analysis
~~~

## AI Buyer APIs

~~~text
POST /api/ai-buyer/recommend
GET  /api/ai-buyer/catalog
POST /api/ai-buyer/order
POST /api/ai-buyer/payment
POST /api/ai-buyer/verify
~~~

---

# Security

MerchantOS uses:

- JWT authentication
- bcrypt password hashing
- Environment-based secrets
- Server-side Razorpay payment verification
- Agent approval gating
- Risk and policy evaluation
- Decision evidence
- Action audit trails
- Failure and recovery handling

Never commit:

- MongoDB credentials
- JWT secrets
- Razorpay secrets
- Groq API keys
- `.env` files

---

# Database

MerchantOS uses MongoDB with the following primary collections:

- merchants
- products
- orders
- growthanalyses
- agentactions

The application is configured to work with MongoDB Atlas.

---

# Hackathon Positioning

MerchantOS focuses on AI-driven merchant revenue growth and agentic commerce.

The main differentiator is the closed-loop relationship between:

~~~text
AI Intelligence
       ↓
Recommendation
       ↓
Governed Agent Action
       ↓
Transaction
       ↓
Revenue / Inventory Data
       ↓
Analytics
       ↓
Next Recommendation
~~~

Instead of only generating AI suggestions, MerchantOS connects AI intelligence to real commerce workflows with:

- Policy controls
- Merchant approval
- Decision evidence
- Risk evaluation
- Auditability
- Failure recovery
- Payment integration

---

# Agentic Safety Model

~~~text
┌──────────────────────┐
│  AI Recommendation   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Evidence Collection  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Risk Evaluation    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Policy Decision    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    Approval Gate     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│      Execution       │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│     Audit Trail      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Outcome / Recovery   │
└──────────────────────┘
~~~

---

# Project Status

- Frontend complete
- Backend complete
- AI Growth Agent complete
- AI Buyer complete
- Razorpay integration complete
- Agent governance complete
- Approval workflow complete
- Decision evidence complete
- Audit trail complete
- Failure and recovery handling complete
- MongoDB Atlas configured
- Docker configured
- Docker Compose configured
- GitHub repository configured

---

# License

This project was created as a hackathon and portfolio project.
'@ | Set-Content -Path "C:\MerchantOS\README.md" -Encoding UTF8

Add-Content .\.gitignore "`r`n# MongoDB backup`r`nmongo-backup/"

git add README.md .gitignore
git commit -m "Refine README architecture and documentation"
git push
