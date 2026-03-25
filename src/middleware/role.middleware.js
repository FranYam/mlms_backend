// src/middleware/role.middleware.js

const { errorResponse } = require('../utils/response');

/**
 * Middleware factory — restreint l'accès aux rôles spécifiés
 * @param  {...string} roles - Rôles autorisés (ex: 'ADMIN', 'LOAN_OFFICER')
 */
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Non authentifié.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Accès refusé. Rôle requis : ${roles.join(' ou ')}. Votre rôle : ${req.user.role}`,
        403
      );
    }

    next();
  };
};

module.exports = allowRoles;
