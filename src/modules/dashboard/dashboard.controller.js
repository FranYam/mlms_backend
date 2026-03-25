// src/modules/dashboard/dashboard.controller.js

const dashboardService = require('./dashboard.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getStats = async (req, res) => {
  try {
    const stats = await dashboardService.getStats();
    return successResponse(res, stats);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const getOverdue = async (req, res) => {
  try {
    const overdue = await dashboardService.getOverdue();
    return successResponse(res, overdue);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

const getRecentLoans = async (req, res) => {
  try {
    const loans = await dashboardService.getRecentLoans();
    return successResponse(res, loans);
  } catch (e) {
    return errorResponse(res, e.message, e.statusCode || 500);
  }
};

module.exports = { getStats, getOverdue, getRecentLoans };
