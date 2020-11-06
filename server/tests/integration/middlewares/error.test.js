const request = require('supertest');
const Joi = require('joi');
const { startServer, stopServer } = require('../../../config');

let app;

beforeEach(async () => {
  app = await startServer();
});

afterEach(async () => {
  await stopServer();
});

describe('Error Middleware', () => {
  it('should send 500 and a message if an error is raised inside a async function', async () => {
    const message = 'Invalid Payload';

    Joi.object = jest.fn(() => new Error(message));

    const { body } = await request(app).post('/api/v1/login').expect(500);

    expect(body).toBeTruthy();
    expect(body.message).toBeTruthy();
  });
});
