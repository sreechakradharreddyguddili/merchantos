cd C:\MerchantOS

@'
# MerchantOS

## AI-Powered Agentic Commerce Platform

MerchantOS is an AI-powered commerce operating system designed to help merchants increase revenue through intelligent recommendations, agentic growth actions, buyer intent analysis, analytics, and governed payment workflows.

The platform connects merchant intelligence and buyer intelligence into a closed-loop commerce system.

---

## Core Idea

MerchantOS creates a continuous revenue-growth loop:

Merchant Data  
↓  
AI Analysis  
↓  
Revenue Opportunity  
↓  
AI Recommendation  
↓  
Risk & Policy Evaluation  
↓  
Merchant Approval  
↓  
Agent Execution  
↓  
Business Outcome  
↓  
Analytics  
↓  
Next Recommendation

The AI Buyer creates the transaction loop:

Buyer Intent  
↓  
AI Buyer  
↓  
Product Recommendation  
↓  
Cross-Sell  
↓  
Order Creation  
↓  
Razorpay Payment  
↓  
Payment Verification  
↓  
Revenue  
↓  
Merchant Analytics  
↓  
Growth Agent

---

## Features

### AI Growth Agent

The Growth Agent analyzes merchant business data and identifies revenue opportunities such as:

- Conversion improvement
- Payment recovery
- Cross-selling
- Inventory replenishment
- Campaign opportunities
- AI Buyer growth opportunities

### AI Buyer

The AI Buyer helps customers discover relevant products based on buyer intent.

Capabilities include:

- Product catalog discovery
- AI-powered recommendations
- Cross-sell suggestions
- Buyer intent processing
- AI-assisted order creation
- Razorpay payment integration
- Server-side payment verification

### Agent Safety & Governance

MerchantOS does not blindly execute agentic financial actions.

Growth actions can contain:

- Risk level
- Approval requirement
- Policy decision
- Decision reason
- Supporting evidence
- Expected outcome
- Estimated impact
- Source channel
- Audit events
- Execution result
- Failure recovery information

Agent lifecycle:

Recommendation Created → Pending Approval → Approved → Execution Started → Completed

Failure lifecycle:

Execution Started → Failed → Failure Reason → Recovery Strategy → Next Step

---

## Razorpay Integration

Razorpay is integrated as the payment layer.

Payment flow:

AI Buyer  
↓  
Product Selection  
↓  
Order Creation  
↓  
Razorpay Payment  
↓  
Server-Side Verification  
↓  
Order / Payment Update

---

## Merchant Operations

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

## Architecture

MerchantOS consists of three application services:

| Service | Technology | Port |
|---|---|---:|
| Frontend | React + Vite + Nginx | 80 |
| Backend | Node.js + Express | 5000 |
| AI Service | Python + FastAPI | 8000 |
| Database | MongoDB Atlas | External |

Application flow:

Frontend  
↓  
Node.js / Express Backend  
↓  
AI Service / FastAPI  
↓  
Groq / LLM  
↓  
MongoDB Atlas

The backend also manages:

- Authentication
- Products
- Orders
- Analytics
- Growth Agent actions
- AI Buyer workflows
- Razorpay payments

---

## Agentic Commerce Flow

Merchant Data  
↓  
Growth Agent  
↓  
Recommendation  
↓  
Evidence Collection  
↓  
Risk Evaluation  
↓  
Policy Decision  
↓  
Merchant Approval  
↓  
Agent Execution  
↓  
Audit Trail  
↓  
Business Outcome  
↓  
Analytics  
↓  
Next Recommendation

At the same time:

Buyer Intent  
↓  
AI Buyer  
↓  
Recommendation  
↓  
Order  
↓  
Razorpay  
↓  
Payment Verification  
↓  
Revenue Data  
↓  
Merchant Analytics

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Nginx

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Axios
- Razorpay SDK
- Redis client

### AI Service

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

### Database

- MongoDB
- MongoDB Atlas

### Payments

- Razorpay

### DevOps

- Git
- GitHub
- Docker
- Docker Compose

### Future / Extended Infrastructure

- AWS
- Kubernetes
- Terraform
- GitHub Actions
- Prometheus
- Grafana

---

## Docker

MerchantOS is containerized into three services.

Frontend:
React + Vite + Nginx

Backend:
Node.js + Express

AI Service:
Python + FastAPI

Docker Compose manages the application services together.

---

## Project Structure

merchantos/

    ai-service/
        app/
            agents/
            models/
            services/
            tools/
            config.py
            main.py
            routes.py
        Dockerfile
        requirements.txt
        .dockerignore

    backend/
        src/
            config/
            controllers/
            middleware/
            models/
            routes/
            services/
        Dockerfile
        .dockerignore

    frontend/
        src/
            components/
            hooks/
            pages/
            services/
            utils/
        Dockerfile
        nginx.conf
        .dockerignore

    docker-compose.yml
    .dockerignore
    .gitignore
    README.md

---

## Prerequisites

Install:

- Node.js 22+
- Python 3.13+
- Docker Desktop
- Git
- MongoDB or MongoDB Atlas

---

## Environment Variables

Never commit `.env` files or secrets to GitHub.

### Backend

    PORT=5000
    MONGODB_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    RAZORPAY_KEY_ID=<your-razorpay-key>
    RAZORPAY_KEY_SECRET=<your-razorpay-secret>
    AI_SERVICE_URL=http://localhost:8000

### AI Service

    MONGODB_URI=<your-mongodb-uri>
    AI_SERVICE_HOST=0.0.0.0
    AI_SERVICE_PORT=8000
    GROQ_API_KEY=<your-groq-api-key>
    LLM_MODEL=openai/gpt-oss-120b

### Frontend

    VITE_API_BASE_URL=http://localhost:5000/api

---

## Run with Docker

From the project root:

    docker compose up -d --build

Check containers:

    docker compose ps

View backend logs:

    docker compose logs --tail=50 backend

View AI service logs:

    docker compose logs --tail=50 ai-service

View frontend logs:

    docker compose logs --tail=50 frontend

Stop the application:

    docker compose down

---

## Local URLs

Frontend:

    http://localhost

Backend:

    http://localhost:5000

Backend health:

    http://localhost:5000/api/health

AI Service:

    http://localhost:8000

AI Service health:

    http://localhost:8000/api/health

---

## API Overview

### Merchants

    /api/merchants

### Products

    /api/products

### Orders

    /api/orders

### Analytics

    /api/analytics

### Growth Agent

    /api/agent
    /api/agent-actions
    /api/growth-analysis

### AI Buyer

    POST /api/ai-buyer/recommend
    GET  /api/ai-buyer/catalog
    POST /api/ai-buyer/order
    POST /api/ai-buyer/payment
    POST /api/ai-buyer/verify

---

## Security

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

## Database

MerchantOS uses MongoDB with the following primary collections:

- merchants
- products
- orders
- growthanalyses
- agentactions

The application is configured to work with MongoDB Atlas.

---

## GitHub

Repository:

https://github.com/sreechakradharreddyguddili/merchantos

Clone the repository:

    git clone https://github.com/sreechakradharreddyguddili/merchantos.git

    cd merchantos

---

## Running the Project

1. Clone the repository.
2. Configure the required environment variables.
3. Make sure Docker Desktop is running.
4. Start the application:

    docker compose up -d --build

5. Open:

    http://localhost

---

## Hackathon Positioning

MerchantOS focuses on AI-driven merchant revenue growth and agentic commerce.

The main differentiator is the closed-loop relationship between:

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

Instead of only generating AI suggestions, MerchantOS connects AI intelligence to actual commerce workflows with:

- Policy controls
- Merchant approval
- Decision evidence
- Risk evaluation
- Auditability
- Failure recovery
- Payment integration

---

## Agentic Safety Model

AI Recommendation  
↓  
Evidence Collection  
↓  
Risk Evaluation  
↓  
Policy Decision  
↓  
Approval Gate  
↓  
Execution  
↓  
Audit Trail  
↓  
Outcome / Recovery

---

## Project Status

- Frontend complete
- Backend complete
- AI Growth Agent complete
- AI Buyer complete
- Razorpay integration complete
- Agent governance complete
- Approval workflow complete
- Decision evidence complete
- Audit trail complete
- Failure / recovery handling complete
- MongoDB Atlas configured
- Docker configured
- Docker Compose configured
- GitHub repository configured

---

## License

This project was created as a hackathon and portfolio project.
'@ | Set-Content -Path "C:\MerchantOS\README.md" -Encoding UTF8

Add-Content .\.gitignore "`r`n# MongoDB backup`r`nmongo-backup/"

git add README.md .gitignore
git commit -m "Improve project documentation"
git push
