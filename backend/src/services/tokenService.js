const jwt = require('jsonwebtoken');

function issueToken(user) {
  return jwt.sign(
    { id: user.id || user._id, role: user.role, storeId: user.storeId },
    process.env.JWT_SECRET || 'red-x-local-dev-secret',
    { expiresIn: '7d' }
  );
}

module.exports = { issueToken };
