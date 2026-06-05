const jwt = require('jsonwebtoken');
const data = require('../services/dataService');

async function protect(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401);
    return next(new Error('Authentication token is required'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'red-x-local-dev-secret');
    const user = await data.users.findById(payload.id);
    if (!user || user.status !== 'active') {
      res.status(401);
      return next(new Error('Account is not active'));
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Invalid or expired token'));
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error('You do not have permission to perform this action'));
    }
    next();
  };
}

module.exports = { protect, allowRoles };
