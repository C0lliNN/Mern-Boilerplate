const mongoose = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');

mongoose.plugin(toJson);
const logger = require('./logger');

exports.startDatabase = async function startDatabase() {
  const DB_URI =
    process.env.NODE_ENV === 'test'
      ? 'mongodb://localhost/test'
      : process.env.MONGO_URI;

  await mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  logger.info('Connected to MongoDB...');
};

// Used only for testing
exports.dropDatabase = function dropDatabase() {
  return mongoose.connection.dropDatabase();
};
