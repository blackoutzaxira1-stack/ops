const express = require('express');
const os = require('os');
const logger = require('./logger');
const metrics = require('./metrics');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

// Internal flag for readiness simulation
let isReady = false;

// Middleware to track metrics for every request
app.use((req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;
    const path = req.route ? req.route.path : req.path;
    
    const labels = {
      method: req.method,
      path: path,
      status: res.statusCode
    };

    // Record metrics
    metrics.httpRequestCounter.inc(labels);
    metrics.httpRequestDuration.observe(labels, durationInSeconds);

    // Track errors (4xx and 5xx)
    if (res.statusCode >= 400) {
      metrics.httpErrorCounter.inc(labels);
    }

    // Structured log for every request
    logger.info({
      msg: 'request completed',
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: durationInSeconds,
      remoteAddress: req.ip,
      // Add K8s context if available via env vars (standard practice)
      pod: process.env.POD_NAME,
      namespace: process.env.POD_NAMESPACE
    });
  });
  
  next();
});

/**
 * Root Endpoint
 * Returns basic metadata about the running instance.
 */
app.get('/', async (req, res) => {
  let dbStatus = 'unknown';
  try {
    const dbCheck = await db.checkConnection();
    dbStatus = dbCheck ? 'connected' : 'disconnected';
  } catch (err) {
    dbStatus = 'error';
  }

  res.json({
    app: 'devops-node-app',
    version: '1.0.0',
    environment: ENV,
    hostname: os.hostname(),
    uptime: process.uptime(),
    database: dbStatus,
    pod_name: process.env.POD_NAME || 'local',
    pod_namespace: process.env.POD_NAMESPACE || 'local'
  });
});

/**
 * Liveness Probe
 * Used by Kubernetes to determine if the container is alive.
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

/**
 * Readiness Probe
 * Used by Kubernetes to determine if the container is ready to accept traffic.
 */
app.get('/ready', async (req, res) => {
  const isDbConnected = await db.checkConnection();
  if (isReady && isDbConnected) {
    res.status(200).json({ status: 'READY' });
  } else {
    res.status(503).json({ 
      status: 'NOT_READY',
      app_ready: isReady,
      db_connected: isDbConnected
    });
  }
});

/**
 * Metrics Endpoint
 * Scraped by Prometheus.
 */
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', metrics.register.contentType);
    res.end(await metrics.register.metrics());
  } catch (err) {
    logger.error({ err }, 'Error generating metrics');
    res.status(500).end(err);
  }
});

/**
 * Graceful Shutdown
 */
function shutdown(server, signal) {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  isReady = false;

  if (server) {
    server.close(async () => {
      logger.info('Http server closed.');
      try {
        await db.pool.end();
        logger.info('Database pool closed.');
      } catch (err) {
        logger.error({ err }, 'Error closing database pool');
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }

  setTimeout(() => {
    logger.warn('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

// Start server
if (require.main === module) {
  const server = app.listen(PORT, async () => {
    logger.info(`Server started on port ${PORT}`);
    
    // Check DB connection on startup
    const dbConnected = await db.checkConnection();
    if (dbConnected) {
      logger.info('Successfully connected to database');
    } else {
      logger.error('Failed to connect to database on startup');
    }

    // Simulate application initialization delay
    setTimeout(() => {
      isReady = true;
      logger.info('Application is now ready to accept traffic');
    }, 2000);
  });

  process.on('SIGTERM', () => shutdown(server, 'SIGTERM'));
  process.on('SIGINT', () => shutdown(server, 'SIGINT'));
}

module.exports = app;
