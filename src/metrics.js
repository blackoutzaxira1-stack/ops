const client = require('prom-client');

// Enable default metrics (CPU, Memory, Event Loop, etc.)
client.collectDefaultMetrics({
  prefix: 'node_app_',
  labels: { app: 'devops-node-app' }
});

// Custom HTTP request counter
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status']
});

// Custom HTTP request duration histogram
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10] // Tailored for typical web response times
});

// Application uptime gauge
const appUptime = new client.Gauge({
  name: 'app_uptime_seconds',
  help: 'Application uptime in seconds'
});

// Update uptime every 5 seconds
setInterval(() => {
  appUptime.set(process.uptime());
}, 5000);

module.exports = {
  register: client.register,
  httpRequestCounter,
  httpRequestDuration,
  httpErrorCounter: new client.Counter({
    name: 'http_errors_total',
    help: 'Total number of HTTP errors',
    labelNames: ['method', 'path', 'status']
  })
};
