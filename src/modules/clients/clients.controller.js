// src/modules/clients/clients.controller.js

const clientsService = require('./clients.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getAll = async (req, res) => {
  try {
    const clients = await clientsService.getAll(req.query.search);
    return successResponse(res, clients);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const client = await clientsService.getById(req.params.id);
    return successResponse(res, client);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const { name, phone, address, email } = req.body;
    if (!name || !phone || !address) {
      return errorResponse(res, 'Champs requis : name, phone, address', 400);
    }
    const client = await clientsService.create({ name, phone, address, email });
    return successResponse(res, client, 201);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const client = await clientsService.update(req.params.id, req.body);
    return successResponse(res, client);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    const result = await clientsService.remove(req.params.id);
    return successResponse(res, result);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
