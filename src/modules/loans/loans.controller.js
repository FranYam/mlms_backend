// src/modules/loans/loans.controller.js

const loansService = require('./loans.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getAll = async (req, res) => {
  try {
    const loans = await loansService.getAll();
    return successResponse(res, loans);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const loan = await loansService.getById(req.params.id);
    return successResponse(res, loan);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const getSchedule = async (req, res) => {
  try {
    const schedule = await loansService.getSchedule(req.params.id);
    return successResponse(res, schedule);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const getOverdue = async (req, res) => {
  try {
    const loans = await loansService.getOverdue();
    return successResponse(res, loans);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const getByClient = async (req, res) => {
  try {
    const loans = await loansService.getByClient(req.params.clientId);
    return successResponse(res, loans);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const getMyLoan = async (req, res) => {
  try {
    const loans = await loansService.getMyLoan(req.user.clientId);
    return successResponse(res, loans);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const { clientId, amount, interestRate, duration } = req.body;
    if (!clientId || !amount || !interestRate || !duration) {
      return errorResponse(res, 'Champs requis : clientId, amount, interestRate, duration', 400);
    }
    const loan = await loansService.create({ clientId, amount, interestRate, duration }, req.user.id);
    return successResponse(res, loan, 201);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'COMPLETED', 'OVERDUE'].includes(status)) {
      return errorResponse(res, 'Statut invalide. Valeurs : ACTIVE, COMPLETED, OVERDUE', 400);
    }
    const loan = await loansService.updateStatus(req.params.id, status);
    return successResponse(res, loan);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

module.exports = { getAll, getById, getSchedule, getOverdue, getByClient, getMyLoan, create, updateStatus };
