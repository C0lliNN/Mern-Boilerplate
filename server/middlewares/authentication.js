/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const HEADER_REGEX = /^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/i;

module.exports = function authentication(req, res, next) {
  const header = req.header('Authorization');

  if (!header) {
    res.setHeader('WWW-Authenticate', 'Bearer <token>');
    return res.status(401).send({ message: 'A token must be provided' });
  }

  if (!header.match(HEADER_REGEX)) {
    res.setHeader('WWW-Authenticate', 'Bearer <token>');
    return res.status(400).send({ message: 'Invalid Token' });
  }

  const token = header.substring(7);
  const key = process.env.JWT_KEY || 'TEST';

  try {
    const user = jwt.verify(token, key);
    req.user = user;
  } catch (error) {
    res.setHeader('WWW-Authenticate', 'Bearer <token>');
    return res.status(400).send({ message: 'Invalid Token' });
  }

  next();
};
