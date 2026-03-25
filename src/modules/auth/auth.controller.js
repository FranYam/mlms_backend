// src/modules/auth/auth.controller.js

const authService = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/response');

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, result);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

const logout = (req, res) => {
  // JWT stateless — le client supprime le token de son côté
  return successResponse(res, { message: 'Déconnexion réussie' });
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    return successResponse(res, user);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

module.exports = { login, logout, getMe };
