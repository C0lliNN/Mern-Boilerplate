const request = require('supertest');
const bcrypt = require('bcrypt');
const { name, internet } = require('faker');
const { startServer, stopServer } = require('../../../config');
const { User } = require('../../../models/user');

let app = null;
let token = null;

function exec(code) {
  const requestBuilder = request(app).get('/api/v1/todos');

  if (token) {
    requestBuilder.set('Authorization', `Bearer ${token}`);
  }

  return requestBuilder.expect(code);
}

async function seedDatabase() {
  const encryptedPassword = await bcrypt.hash(internet.password(10), 12);

  const user = await User.create({
    name: name.findName(),
    email: internet.email(),
    password: encryptedPassword,
  });

  token = user.generateToken();
}

beforeEach(async () => {
  app = await startServer();
  await seedDatabase();
});

afterEach(async () => {
  await stopServer();
});

describe('Authentication Middleware', () => {
  it('should return 401 if no token is provided', async () => {
    token = null;

    const { body } = await exec(401);

    expect(body.message).toMatch(/token.*provide/i);
  });
  it('should return 400 if the token is invalid', async () => {
    token = '1234566';

    const { body } = await exec(400);

    expect(body.message).toMatch(/invalid.*token/i);
  });
  it('should continue the request if the token is valid', async () => {
    await exec(200);
  });
});
