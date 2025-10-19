const jwt = require('jsonwebtoken');

const sign = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

const verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
}

module.exports = { sign, verify };
