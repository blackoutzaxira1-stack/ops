const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'devops_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  // Max number of clients in the pool
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle database client');
});

const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug({ text, duration, rows: res.rowCount }, 'Executed query');
    return res;
  } catch (err) {
    logger.error({ err, text }, 'Database query error');
    throw err;
  }
};

const checkConnection = async () => {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (err) {
    logger.error({ err }, 'Database connection failed');
    return false;
  }
};

module.exports = {
  query,
  checkConnection,
  pool
};
