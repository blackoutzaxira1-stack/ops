# DevOps Node.js Application (Distinction Level)

This project is a production-grade Node.js application refactored to meet **Distinction-level** academic and industry standards for DevOps, Cloud-Native Architecture, and Observability.

## 🚀 Key Features

- **Node.js Backend**: Express-based API with PostgreSQL integration.
- **Full CI Pipeline**: GitHub Actions for linting, testing, and automated Docker builds.
- **Kubernetes Native**: Optimized for MicroK8s with Helm charts and raw manifests.
- **Advanced Observability**: 
  - **Metrics**: Custom Prometheus metrics (Request Rate, Latency, Error Rate).
  - **Logging**: Structured JSON logging with Pino, ready for Loki.
  - **Health Checks**: Liveness and Readiness probes integrated with application state.
- **12-Factor Compliant**: Environment-based configuration using ConfigMaps and Secrets.

## 📁 Project Structure

```text
.
├── .github/workflows/   # CI/CD Pipelines
├── charts/              # Helm Charts
│   └── devops-node-app/ # Application Helm Chart
├── k8s/                 # Raw Kubernetes Manifests
│   ├── database/        # PostgreSQL Manifests
│   └── ...              # App Manifests (Deployment, Service, etc.)
├── src/                 # Application Source Code
│   ├── db.js            # Database Integration
│   ├── index.js         # Main Application Logic
│   ├── logger.js        # Structured Logging
│   └── metrics.js       # Prometheus Metrics
├── Dockerfile           # Container Definition
└── .env.example         # Configuration Template
```

## 🛠️ Local Development (Parrot OS / MicroK8s)

### Prerequisites
- MicroK8s installed and running.
- `kubectl` and `helm` configured.
- Node.js 20+ (for local testing).

### Running with Helm (Recommended)
```bash
# Install dependencies
helm dependency update ./charts/devops-node-app

# Install the application
helm install devops-app ./charts/devops-node-app
```

### Running with Manifests
```bash
# Deploy Database
kubectl apply -f k8s/database/

# Deploy Application
kubectl apply -f k8s/
```

## 📊 Observability

### Metrics
The application exposes metrics at `/metrics`.
- `http_requests_total`: Counter for request volume.
- `http_request_duration_seconds`: Histogram for latency.
- `http_errors_total`: Counter for 4xx/5xx errors.

### Logging
Logs are output in structured JSON format to `stdout`.
Labels included: `app`, `version`, `hostname`, `env`, `pod`, `namespace`.

## 🧪 CI Pipeline
The GitHub Actions pipeline (`.github/workflows/ci.yml`) includes:
1. **Quality Assurance**: Dependency caching, linting, and unit tests.
2. **Build & Push**: Multi-arch Docker builds pushed to Docker Hub (requires `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets).

## ⚖️ License
MIT
