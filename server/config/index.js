require('dotenv').config();
require('express-async-errors');
const express = require('express');
const logger = require('./logger');
const { startDatabase,  dropDatabase } = require('./database');
const routes = require('../routes/index.js');

const app = express();
app.use('/', routes);

let server = null;

exports.startServer = async function startServer() {
  await startDatabase();

  const port = process.env.PORT || 5000;

  server = app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });

  return app;
};

// Used only in testing environment
exports.stopServer = async function stopServer() {
  await dropDatabase();

  server?.close();
};
