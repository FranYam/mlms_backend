// src/utils/response.js

/**
 * Réponse succès standard
 * @param {object} res - Express response
 * @param {*} data - Données à retourner
 * @param {number} statusCode - Code HTTP (défaut: 200)
 */
const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

/**
 * Réponse erreur standard
 * @param {object} res - Express response
 * @param {string} message - Message d'erreur
 * @param {number} statusCode - Code HTTP (défaut: 500)
 * @param {*} errors - Détails des erreurs de validation (optionnel)
 */
const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

module.exports = { successResponse, errorResponse };
