const winston = require('winston');

const { createLogger, format, transports } = winston;

const formatter = (info) => `${info.level}: ${info.message}`;

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.json(),
  ),
  transports: [new transports.File({ filename: 'logs/logfile.log' })],
  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'logs/rejections.log' })],
});

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.printf(formatter)),
    }),
  );
}

module.exports = logger;
