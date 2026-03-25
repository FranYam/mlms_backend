// src/modules/users/users.controller.js

const usersService = require('./users.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getAll = async (req, res) => {
  try {
    const users = await usersService.getAll();
    return successResponse(res, users);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const user = await usersService.getById(req.params.id);
    return successResponse(res, user);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const user = await usersService.create(req.body);
    return successResponse(res, user, 201);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const user = await usersService.update(req.params.id, req.body);
    return successResponse(res, user);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    const result = await usersService.remove(req.params.id);
    return successResponse(res, result);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      return errorResponse(res, 'Statut invalide. Valeurs acceptées : ACTIVE, INACTIVE', 400);
    }
    const user = await usersService.updateStatus(req.params.id, status);
    return successResponse(res, user);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove, updateStatus };
