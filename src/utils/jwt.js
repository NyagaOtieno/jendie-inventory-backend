const jwt = require('jsonwebtoken');

// Sign a new token
const sign = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Default expiration is 1 hour
  });
};

// Verify the token and decode it
const verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET); // This will throw an error if token is invalid
};

module.exports = { sign, verify };
