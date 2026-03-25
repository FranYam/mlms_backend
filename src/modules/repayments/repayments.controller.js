// src/modules/repayments/repayments.controller.js

const repaymentsService = require('./repayments.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getByLoan = async (req, res) => {
  try {
    const repayments = await repaymentsService.getByLoan(req.params.loanId);
    return successResponse(res, repayments);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const getPending = async (req, res) => {
  try {
    const pending = await repaymentsService.getPending(req.params.loanId);
    return successResponse(res, pending);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const record = async (req, res) => {
  try {
    const { loanId, scheduleId, amount, note } = req.body;
    if (!loanId || !amount) {
      return errorResponse(res, 'Champs requis : loanId, amount', 400);
    }
    const repayment = await repaymentsService.record(
      { loanId, scheduleId, amount, note },
      req.user.id
    );
    return successResponse(res, repayment, 201);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

module.exports = { getByLoan, getPending, record };
