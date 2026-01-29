const pino = require('pino');
const os = require('os');

/**
 * Structured JSON logging for Kubernetes environments.
 * Logs to stdout to be captured by container log drivers (Fluentd, Loki, etc.)
 */
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    app: 'devops-node-app',
    version: '1.0.0',
    hostname: os.hostname(),
    env: process.env.NODE_ENV || 'development'
  },
  timestamp: pino.stdTimeFunctions.isoTime
});

module.exports = logger;
