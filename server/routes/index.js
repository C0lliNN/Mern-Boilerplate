const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const users = require('./users');
const todos = require('./todos');
const error = require('../middlewares/error');

const router = express.Router();

if (process.env.NODE_ENV !== 'production') {
  router.use(cors());
}

router.use(compression());
router.use(helmet({ contentSecurityPolicy: false }));
router.use(express.json());

router.use('/api/v1', users);
router.use('/api/v1/todos', todos);

if (process.env.NODE_ENV === 'production') {
  router.use(express.static(path.resolve(__dirname, '../public')));

  router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
  });
}

router.use(error);

module.exports = router;
