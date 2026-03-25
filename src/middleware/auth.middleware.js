// src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Token manquant. Veuillez vous connecter.', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, clientId }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session expirée. Veuillez vous reconnecter.', 401);
    }
    return errorResponse(res, 'Token invalide.', 401);
  }
};

module.exports = auth;
