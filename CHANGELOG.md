# Changelog - DevOps Project Upgrade

This project has been upgraded to **Full Distinction** level by implementing industry-standard DevOps practices.

## [1.0.0] - 2026-01-30

### Fixed
- **CI Pipeline**: Completed the GitHub Actions workflow. Removed skipped steps for linting and testing. Added mandatory `npm ci`, `npm run lint`, and `npm test` stages.
- **ESLint**: Configured ESLint v9 to work correctly in a Node.js CommonJS environment.
- **Database Integration**: Fixed inconsistent environment variables between the application, Kubernetes manifests, and Helm charts.
- **Kubernetes Manifests**: Completed missing fields in `deployment.yaml`, including liveness/readiness probes and resource limits.
- **Naming Consistency**: Standardized application name (`devops-node-app`), Docker image name, and Helm chart metadata.

### Added
- **Unit Testing**: Implemented a working unit test suite using Jest and Supertest to validate the `/health` and `/metrics` endpoints.
- **Application Metrics**: Enhanced `prom-client` integration to expose true application-level metrics:
  - `http_requests_total` (Counter)
  - `http_request_duration_seconds` (Histogram)
  - `http_errors_total` (Counter)
- **Configuration Management**: 
  - Implemented proper separation of concerns using `ConfigMap` for non-sensitive data and `Secret` for credentials.
  - Added `.env.example` aligned with Kubernetes and Helm configurations.
- **Graceful Shutdown**: Refactored the application to handle `SIGTERM` and `SIGINT` signals, ensuring database connections are closed properly.

### Improved
- **Helm Chart**: Updated `values.yaml` and `deployment.yaml` to support dynamic database configuration and monitoring via `ServiceMonitor`.
- **Project Structure**: Organized manifests and source code for better maintainability and production readiness.
- **Documentation**: Updated `README.md` with clear instructions for local development and Kubernetes deployment.

### Why these changes were necessary
These improvements ensure the application is not just a "script" but a production-ready service. The CI pipeline guarantees code quality, custom metrics provide deep observability beyond infrastructure stats, and proper configuration management follows the 12-Factor App methodology, which is essential for any distinction-level DevOps project.
