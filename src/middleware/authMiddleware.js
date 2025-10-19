const { verify } = require('../utils/jwt');

// Middleware for verifying if the user is authenticated
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or incorrect format' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify the token using the verify method from utils/jwt.js
    const decoded = verify(token); 
    req.user = decoded; // Add decoded info to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if the user has the required role
const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden, insufficient permissions' });
  }

  next();
};

module.exports = { auth, requireRole };
