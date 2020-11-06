const { name, internet, lorem } = require('faker');
const { validateUser } = require('../../../models/user');

let data = null;

describe('validateUser()', () => {
  beforeEach(() => {
    data = {
      name: name.findName(),
      email: internet.email(),
      password: internet.password(10),
    };
  });
  it('should return an error if name is falsy', () => {
    data.name = null;

    const { error } = validateUser(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/name/);
  });
  it('should return an error if name is not a string', () => {
    data.name = 81;

    const { error } = validateUser(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/name/);
  });
  it('should return an error if name has less than 3 chars', () => {
    data.name = 'ra';

    const { error } = validateUser(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/name/);
  });
  it('should return an error if name has more than 40 chars', () => {
    data.name = lorem.sentence(20);

    const { error } = validateUser(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/name/);
  });
  it('should return an error if email is falsy', () => {
    data.email = undefined;

    const { error } = validateUser(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/email/);
  });
  it('should return an error if email is not a string', () => {
    data.email = {};

    const { error } = validateUser(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/email/);
  });
  it('should return an error if email is not a valid email', () => {
    data.email = 'ra12345';

    const { error } = validateUser(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/email/);
  });
  it('should return an error if password is falsy', () => {
    data.password = false;

    const { error } = validateUser(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/password/);
  });
  it('should return an error if password is not a string', () => {
    data.password = 11;

    const { error } = validateUser(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/password/);
  });
  it('should return an error if password has less than 6 chars', () => {
    data.password = 'ras2';

    const { error } = validateUser(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/password/);
  });
  it('should return an error if password has more than 64 chars', () => {
    data.password = lorem.sentence(32);

    const { error } = validateUser(data);

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/password/);
  });
  it('should return true if data is valid', () => {
    const { error } = validateUser(data);

    expect(error).toBeFalsy();
  });
});
