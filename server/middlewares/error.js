const logger = require('../config/logger');

module.exports = function errorMiddleware(err, req, res, next) {
  res.status(500).send({
    message: 'Unexpected Error!',
  });

  logger.error(err.message, err);
};
