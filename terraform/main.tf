terraform {
  required_version = ">= 1.14.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.38"
    }
  }
}

provider "kubernetes" {
  config_path    = "~/.kube/config"
  config_context = "docker-desktop"
}

variable "mongodb_uri" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "razorpay_key_id" {
  type      = string
  sensitive = true
}

variable "razorpay_key_secret" {
  type      = string
  sensitive = true
}

variable "groq_api_key" {
  type      = string
  sensitive = true
}

variable "llm_model" {
  type      = string
  sensitive = true
}

resource "kubernetes_namespace" "merchantos" {
  metadata {
    name = "merchantos-tf"
  }
}

resource "kubernetes_secret" "merchantos" {
  metadata {
    name      = "merchantos-secrets"
    namespace = kubernetes_namespace.merchantos.metadata[0].name
  }

  type = "Opaque"

  data = {
    MONGODB_URI        = var.mongodb_uri
    JWT_SECRET         = var.jwt_secret
    RAZORPAY_KEY_ID    = var.razorpay_key_id
    RAZORPAY_KEY_SECRET = var.razorpay_key_secret
    GROQ_API_KEY       = var.groq_api_key
    LLM_MODEL          = var.llm_model
  }
}

resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.merchantos.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend"
        }
      }

      spec {
        container {
          name              = "frontend"
          image             = "merchantos-frontend"
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.merchantos.metadata[0].name
  }

  spec {
    selector = {
      app = "frontend"
    }

    type = "NodePort"

    port {
      port        = 80
      target_port = 80
      node_port   = 30090
    }
  }
}

resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace.merchantos.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        container {
          name              = "backend"
          image             = "merchantos-backend"
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 5000
          }

          env {
            name  = "NODE_ENV"
            value = "production"
          }

          env {
            name  = "PORT"
            value = "5000"
          }

          env {
            name = "MONGODB_URI"

            value_from {
              secret_key_ref {
                name = kubernetes_secret.merchantos.metadata[0].name
                key  = "MONGODB_URI"
              }
            }
          }

          env {
            name = "JWT_SECRET"

            value_from {
              secret_key_ref {
                name = kubernetes_secret.merchantos.metadata[0].name
                key  = "JWT_SECRET"
              }
            }
          }

          env {
            name = "RAZORPAY_KEY_ID"

            value_from {
              secret_key_ref {
                name = kubernetes_secret.merchantos.metadata[0].name
                key  = "RAZORPAY_KEY_ID"
              }
            }
          }

          env {
            name = "RAZORPAY_KEY_SECRET"

            value_from {
              secret_key_ref {
                name = kubernetes_secret.merchantos.metadata[0].name
                key  = "RAZORPAY_KEY_SECRET"
              }
            }
          }

          env {
            name  = "AI_SERVICE_URL"
            value = "http://ai-service:8000"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace.merchantos.metadata[0].name
  }

  spec {
    selector = {
      app = "backend"
    }

    port {
      port        = 5000
      target_port = 5000
    }
  }
}

resource "kubernetes_deployment" "ai_service" {
  metadata {
    name      = "ai-service"
    namespace = kubernetes_namespace.merchantos.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "ai-service"
      }
    }

    template {
      metadata {
        labels = {
          app = "ai-service"
        }
      }

      spec {
        container {
          name              = "ai-service"
          image             = "merchantos-ai-service"
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 8000
          }

          env {
            name  = "AI_SERVICE_HOST"
            value = "0.0.0.0"
          }

          env {
            name  = "AI_SERVICE_PORT"
            value = "8000"
          }

          env {
            name = "MONGODB_URI"

            value_from {
              secret_key_ref {
                name = kubernetes_secret.merchantos.metadata[0].name
                key  = "MONGODB_URI"
              }
            }
          }

          env {
            name = "GROQ_API_KEY"

            value_from {
              secret_key_ref {
                name = kubernetes_secret.merchantos.metadata[0].name
                key  = "GROQ_API_KEY"
              }
            }
          }

          env {
            name = "LLM_MODEL"

            value_from {
              secret_key_ref {
                name = kubernetes_secret.merchantos.metadata[0].name
                key  = "LLM_MODEL"
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "ai_service" {
  metadata {
    name      = "ai-service"
    namespace = kubernetes_namespace.merchantos.metadata[0].name
  }

  spec {
    selector = {
      app = "ai-service"
    }

    port {
      port        = 8000
      target_port = 8000
    }
  }
}

output "frontend_url" {
  value = "http://localhost:30090"
}

output "namespace" {
  value = kubernetes_namespace.merchantos.metadata[0].name
}
