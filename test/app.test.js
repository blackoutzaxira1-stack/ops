const request = require('supertest');
const express = require('express');
const os = require('os');

// Mock dependencies
jest.mock('../src/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

jest.mock('../src/metrics', () => ({
  register: {
    contentType: 'text/plain',
    metrics: jest.fn().mockResolvedValue('')
  },
  httpRequestCounter: { inc: jest.fn() },
  httpRequestDuration: { observe: jest.fn() },
  httpErrorCounter: { inc: jest.fn() },
  collectDefaultMetrics: jest.fn()
}));

jest.mock('../src/db', () => ({
  checkConnection: jest.fn().mockResolvedValue(true),
  pool: { end: jest.fn() }
}));

// We need to require the app but index.js starts the server.
// For testing, it's better to export the app from index.js.
// Since we can't easily change the structure without affecting the user's intent,
// we will create a minimal app for testing the health endpoint or refactor index.js.
// Let's refactor index.js to export the app.

const app = require('../src/index');

describe('API Endpoints', () => {
  test('GET /health should return 200 UP', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'UP' });
  });

  test('GET /metrics should return 200', async () => {
    const response = await request(app).get('/metrics');
    expect(response.statusCode).toBe(200);
  });
});
