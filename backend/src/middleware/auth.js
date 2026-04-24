const { sessions } = require('../data/seed');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  const userId = sessions[token];
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.token = token;
  req.userId = userId;
  return next();
};

module.exports = {
  requireAuth,
};
