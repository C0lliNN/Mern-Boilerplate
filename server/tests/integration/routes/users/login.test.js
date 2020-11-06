const request = require('supertest');
const bcrypt = require('bcrypt');
const { startServer, stopServer } = require('../../../../config');
const { User } = require('../../../../models/user');

let app = null;
let payload = null;

function exec(code) {
  return request(app).post('/api/v1/login').send(payload).expect(code);
}

async function seedDatabase() {
  const encryptedPassword = await bcrypt.hash('99994444', 12);

  await User.create({
    name: 'Test User',
    email: 'test@test.com',
    password: encryptedPassword,
  });
}

beforeEach(async () => {
  app = await startServer();
  await seedDatabase();
});

afterEach(async () => {
  await stopServer();
});

describe('POST /login', () => {
  beforeEach(() => {
    payload = {
      email: 'test@test.com',
      password: '99994444',
    };
  });

  it('should return 400 if the email is invalid', async () => {
    payload.email = 'test';

    const { body } = await exec(400);

    expect(body).toHaveProperty('message');
    expect(body.message).toMatch(/email/i);
  });

  it('should return 400 if the password is invalid', async () => {
    payload.password = null;

    const { body } = await exec(400);

    expect(body).toHaveProperty('message');
    expect(body.message).toMatch(/password/i);
  });
  it('should return 422 if there is no match for the email', async () => {
    payload.email = 'test2@test.com';

    const { body } = await exec(422);

    expect(body).toHaveProperty('message');
    expect(body.message).toMatch(/email/i);
  });
  it('should return 400 if password is incorrect', async () => {
    payload.password = '99984444';

    const { body } = await exec(422);

    expect(body).toHaveProperty('message');
    expect(body.message).toMatch(/password/i);
  });

  it('should return 200 if the payload is valid and match correctly', async () => {
    const { body } = await exec(200);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('token');
  });
});
