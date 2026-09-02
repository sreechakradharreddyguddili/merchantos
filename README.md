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
│   Cross-Selling     │
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
│      Execution       │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│     Audit Trail      │
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
                      ┌──────────────────┴───────────────────┐
                      │                                      │
                      ▼                                      ▼
             ┌──────────────────┐                  ┌──────────────────┐
             │  React Frontend  │                  │  AI Intelligence │
             │  React + Vite    │                  │     FastAPI      │
             │      Nginx       │                  └────────┬─────────┘
             └────────┬─────────┘                           │
                      │                                      ├──────────────┐
                      ↓                                      ↓              ↓
             ┌──────────────────┐                    ┌──────────────┐ ┌──────────────┐
             │ Node.js Backend  │                    │ Growth Agent │ │   AI Buyer   │
             │    Express.js    │                    └──────┬───────┘ └──────┬───────┘
             └────────┬─────────┘                           │                │
                      │                                     └────────┬───────┘
             ┌────────┼──────────┐                                      │
             │        │          │                                      ▼
             ▼        ▼          ▼                               ┌──────────────┐
       ┌─────────┐ ┌─────────┐ ┌───────────┐                     │   Groq / LLM │
       │Products │ │ Orders  │ │ Analytics │                     └──────────────┘
       └────┬────┘ └────┬────┘ └─────┬─────┘
            │           │            │
            └───────────┼────────────┘
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
                  ┌────────┴──────────┐
                  │                   │
                  ▼                   ▼
         ┌────────────────┐   ┌────────────────┐
         │ Evidence       │   │ Risk Evaluation│
         └───────┬────────┘   └───────┬────────┘
                 │                    │
                 └──────────┬─────────┘
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
                     │    Revenue   │
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
                  ┌───┴──────┐
                  ▼          ▼
           ┌──────────────┐ ┌──────────────┐
           │ Growth Agent │ │   AI Buyer   │
           └──────┬───────┘ └──────┬───────┘
                  │                │
                  ▼                ▼
        ┌────────────────┐ ┌────────────────┐
        │Recommendations │ │ Buyer Intent   │
        └───────┬────────┘ └───────┬────────┘
                │                  │
                ▼                  ▼
        ┌────────────────┐ ┌────────────────┐
        │ Policy + Risk  │ │     Order      │
        └───────┬────────┘ └───────┬────────┘
                │                  │
                ▼                  ▼
        ┌────────────────┐ ┌────────────────┐
        │    Approval    │ │    Razorpay    │
        └───────┬────────┘ └───────┬────────┘
                │                  │
                ▼                  ▼
        ┌────────────────┐ ┌────────────────┐
        │    Execution   │ │ Payment Verify │
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
│                           │        AI Service          │   │
│                           │                            │   │
│                           │ Python + FastAPI            │   │
│                           │ Port 8000                  │   │
│                           └──────────────┬─────────────┘   │
└──────────────────────────────────────────┼─────────────────┘
                                           │
                                ┌──────────┴────────────┐
                                ▼                       ▼
                         ┌──────────────┐         ┌────────────┐
                         │ MongoDB Atlas │         │    Groq    │
                         └──────────────┘         └────────────┘
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
- Swagger UI Express
- Swagger JSDoc

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
- GitHub Actions
- Jenkins
- Swagger / OpenAPI

## Infrastructure & Monitoring

- Kubernetes
- Terraform
- Prometheus
- Grafana
- Alertmanager
- Node Exporter
- kube-state-metrics

---

# Project Structure

~~~text
merchantos/
│
├── .github/
│   └── workflows/
│       └── ci.yml
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
├── k8s/
│   ├── namespace.yaml
│   ├── frontend.yaml
│   ├── backend.yaml
│   └── ai-service.yaml
│
├── terraform/
│   ├── main.tf
│   └── .terraform.lock.hcl
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
- Kubernetes support through Docker Desktop
- Terraform
- Helm

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

# Swagger / OpenAPI

MerchantOS includes interactive API documentation through Swagger UI.

Swagger UI:

~~~text
/api-docs
~~~

OpenAPI JSON:

~~~text
/api-docs.json
~~~

The API specification uses OpenAPI 3.0.3 and includes JWT Bearer authentication support.

Swagger was used to verify the MerchantOS APIs, including:

- Health
- Merchant authentication
- Merchant profile
- Products
- Orders
- Analytics
- Growth Agent
- Agent Actions
- Growth Analysis
- Dashboard
- AI Buyer

The AI Buyer recommendation flow was verified successfully through Swagger.

---

# Kubernetes Deployment

MerchantOS can be deployed locally using Docker Desktop Kubernetes.

Application namespace:

~~~text
merchantos
~~~

Terraform-managed namespace:

~~~text
merchantos-tf
~~~

Application workloads:

~~~text
Frontend
Backend
AI Service
~~~

Frontend is exposed through a Kubernetes NodePort.

Backend and AI Service are exposed internally through Kubernetes ClusterIP services.

Secrets are stored in Kubernetes Secrets rather than committed to source control.

---

# Terraform Infrastructure

Terraform is used as Infrastructure as Code for the Kubernetes deployment.

~~~text
Terraform
    ↓
Kubernetes Namespace
    ↓
Kubernetes Secret
    ↓
Frontend Deployment
    ↓
Backend Deployment
    ↓
AI Service Deployment
    ↓
Kubernetes Services
~~~

Terraform was initialized and validated successfully.

Final verification confirmed:

~~~text
No changes. Your infrastructure matches the configuration.
~~~

---

# GitHub Actions CI/CD

MerchantOS uses GitHub Actions for CI/CD validation.

~~~text
Developer
    ↓
GitHub
    ↓
GitHub Actions
    ├── Frontend CI
    │    ├── npm ci
    │    ├── lint
    │    └── build
    │
    ├── Backend CI
    │    └── JavaScript syntax validation
    │
    ├── AI Service CI
    │    └── Python syntax validation
    │
    └── Docker Build
         ├── Frontend image
         ├── Backend image
         └── AI Service image
~~~

The GitHub Actions workflow was verified with successful runs.

Workflow:

~~~text
.github/workflows/ci.yml
~~~

---

# Jenkins Pipeline

Jenkins provides an additional CI/CD pipeline automation layer.

~~~text
GitHub
   ↓
Jenkins
   ↓
Checkout
   ↓
Repository Validation
   ↓
DevOps Configuration Check
   ↓
Pipeline SUCCESS
~~~

The `MerchantOS-Pipeline` Jenkins job was successfully executed.

The pipeline validates:

- Repository structure
- Frontend configuration
- Backend configuration
- AI Service configuration
- Kubernetes manifests
- Terraform configuration
- GitHub Actions workflow configuration

---

# Prometheus & Grafana Monitoring

MerchantOS includes Kubernetes monitoring through Prometheus and Grafana.

~~~text
Kubernetes
    ↓
Prometheus
    ↓
Metrics
    ↓
Grafana
    ↓
Monitoring Dashboards
~~~

Monitoring components include:

- Prometheus
- Grafana
- Alertmanager
- Node Exporter
- kube-state-metrics

Monitoring was installed in the Kubernetes `monitoring` namespace.

Grafana service:

~~~text
monitoring-grafana
~~~

Prometheus service:

~~~text
monitoring-kube-prometheus-prometheus
~~~

For local Docker Desktop Kubernetes access, port forwarding can be used.

Grafana:

~~~bash
kubectl port-forward -n monitoring service/monitoring-grafana 3000:80
~~~

Open:

~~~text
http://localhost:3000
~~~

Prometheus:

~~~bash
kubectl port-forward -n monitoring service/monitoring-kube-prometheus-prometheus 9090:9090
~~~

Open:

~~~text
http://localhost:9090
~~~

The monitoring workloads were verified successfully in Kubernetes.

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
- Terraform state
- Terraform variable files
- MongoDB backups

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

# Hackathon Submission Readiness

The application form asks for 12 items covering personal information and the project build.

## About You

The application asks for:

- Full name
- College
- Graduation year
- In-person from September: yes / no
- 6 or 12 months preference
- Resume file

These are application-form details and should be entered directly into the application rather than stored in the public repository.

## About the Build

### Your Track

Razorpay Hackathon — Track 01: AI-driven merchant revenue growth / agentic commerce.

### Project Name

MerchantOS

### What It Solves

MerchantOS is an AI-powered agentic commerce operating system that helps merchants identify revenue opportunities, process buyer intent, execute governed growth actions, connect transactions to analytics, and continuously generate the next growth decision.

### GitHub Repository

The public GitHub repository contains the MerchantOS source code and project documentation, including:

- Frontend
- Backend
- AI Service
- Docker configuration
- Kubernetes configuration
- Terraform configuration
- GitHub Actions workflow
- Jenkins pipeline
- Swagger/OpenAPI
- Monitoring configuration and deployment documentation
- README

### 5-Minute Pitch Video

To be recorded and submitted separately.

An unlisted video can be used for the application.

The video should demonstrate the working product, core problem, AI Buyer, Growth Agent, governed agent actions, Razorpay workflow, analytics, and the DevOps/monitoring implementation.

### What Broke, and How You Got Out

MerchantOS went through several real engineering failures during development.

See the **Failure Recovery** section below.

---

# Failure Recovery

## GitHub Push Failure

The first GitHub push was rejected because the remote branch contained commits that were not present locally.

Recovery:

~~~text
Local branch
    ↓
git pull --rebase origin main
    ↓
git push origin main
    ↓
Repository synchronized
~~~

## Kubernetes MongoDB Failure

The Kubernetes backend initially entered `CrashLoopBackOff` because the Kubernetes Secret contained a local MongoDB address:

~~~text
127.0.0.1:27017
~~~

A Kubernetes pod could not use the host's localhost MongoDB service.

Recovery:

~~~text
Incorrect MongoDB URI
        ↓
Backend logs inspected
        ↓
Kubernetes Secret corrected
        ↓
MongoDB Atlas URI supplied
        ↓
Backend restarted
        ↓
MongoDB connected successfully
~~~

## Jenkins Pipeline Failure

An early Jenkins pipeline failed because the Terraform directory had not yet been pushed to GitHub.

Recovery:

~~~text
Jenkins validation failure
        ↓
Missing terraform/ directory identified
        ↓
Terraform files committed
        ↓
Pushed to GitHub
        ↓
Jenkins rebuilt
        ↓
Pipeline SUCCESS
~~~

## Prometheus NodePort Conflict

Prometheus initially attempted to use NodePort `30090`, which was already being used by the Terraform-managed MerchantOS frontend.

Recovery:

~~~text
Frontend → NodePort 30090
        ↓
Prometheus port conflict
        ↓
Prometheus moved to NodePort 30091
        ↓
Prometheus deployed successfully
~~~

## Swagger Image Version Issue

Swagger was added after an older backend Docker image had already been deployed to Kubernetes.

The running Kubernetes pod therefore did not contain the newly added Swagger configuration.

Recovery:

~~~text
Swagger added locally
        ↓
New backend Docker image built
        ↓
Versioned image created
        ↓
Kubernetes deployment updated
        ↓
Swagger file verified inside pod
        ↓
Swagger UI verified
        ↓
OpenAPI JSON verified
~~~

## Helm Availability

Helm was not initially available from the PowerShell PATH and Windows `winget` was unavailable.

Recovery:

~~~text
winget unavailable
        ↓
Official Helm binary installed
        ↓
Helm executable verified
        ↓
Prometheus Community chart repository added
        ↓
Monitoring stack installed
~~~

These failures were resolved through log inspection, configuration verification, environment correction, versioned container images, Kubernetes rollout checks, and repeated infrastructure validation.

---

# Final DevOps Architecture

~~~text
                         DEVELOPER
                             │
                             ▼
                           GIT
                             │
                             ▼
                          GITHUB
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
       GITHUB ACTIONS                    JENKINS
              │                             │
       ┌──────┼──────┐               Repository /
       │      │      │                DevOps Checks
       ▼      ▼      ▼
   Frontend Backend AI
      CI      CI     CI
       │      │      │
       └──────┼──────┘
              ▼
        Docker Images
              │
              ▼
         Kubernetes
              │
      ┌───────┼────────┐
      ▼       ▼        ▼
 Frontend Backend  AI Service
              │
              ▼
        MongoDB Atlas
              │
              ▼
          Razorpay

Terraform
    │
    └──────────────► Kubernetes Infrastructure

Swagger / OpenAPI
    │
    └──────────────► API Verification

Prometheus
    │
    └──────────────► Metrics

Grafana
    │
    └──────────────► Monitoring Dashboards
~~~

---

# Final Verification

The final MerchantOS environment was verified successfully.

## Application

~~~text
Frontend                ✅
Backend                 ✅
AI Service              ✅
MongoDB Atlas           ✅
Razorpay Integration    ✅
AI Buyer                ✅
Growth Agent            ✅
Agent Governance        ✅
~~~

## DevOps

~~~text
GitHub                  ✅
GitHub Actions          ✅
Docker                  ✅
Docker Compose          ✅
Kubernetes              ✅
Terraform               ✅
Jenkins                 ✅
Swagger / OpenAPI       ✅
Prometheus              ✅
Grafana                 ✅
~~~

## Kubernetes Verification

The Terraform-managed namespace was verified with all application workloads running:

~~~text
frontend       1/1 Running
backend        1/1 Running
ai-service     1/1 Running
~~~

## Monitoring Verification

Monitoring workloads were verified as running:

~~~text
Prometheus
Grafana
Alertmanager
Node Exporter
kube-state-metrics
~~~

## Terraform Verification

Terraform was verified with no infrastructure drift:

~~~text
No changes. Your infrastructure matches the configuration.
~~~

## GitHub Actions Verification

Recent GitHub Actions workflow runs were verified successfully.

## Jenkins Verification

The `MerchantOS-Pipeline` Jenkins job completed successfully.

## Swagger Verification

Swagger UI was successfully accessed through the Kubernetes backend and the OpenAPI specification returned:

~~~text
OpenAPI 3.0.3
~~~

The AI Buyer recommendation API was also successfully verified through Swagger.

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
- Kubernetes configured
- Terraform infrastructure configured
- GitHub repository configured
- GitHub Actions CI/CD configured
- Jenkins pipeline configured
- Swagger/OpenAPI configured
- Prometheus monitoring configured
- Grafana monitoring configured
- Final Kubernetes deployment verified
- Final Terraform plan verified with no drift
- API verification completed
- Monitoring stack verified

---

# License

This project was created as a hackathon and portfolio project.
