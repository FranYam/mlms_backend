// src/modules/dashboard/dashboard.service.js

const Client = require('../../models/Client');
const Loan = require('../../models/Loan');
const RepaymentSchedule = require('../../models/RepaymentSchedule');

const getStats = async () => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  const [totalClients, activeLoans, overdueLoans, loansDueToday, totalLoanAmountAgg] = await Promise.all([
    Client.countDocuments(),
    Loan.countDocuments({ status: 'ACTIVE' }),
    Loan.countDocuments({ status: 'OVERDUE' }),
    RepaymentSchedule.countDocuments({ status: 'PENDING', dueDate: { $gte: startOfDay, $lte: endOfDay } }),
    Loan.aggregate([
      { $match: { status: { $in: ['ACTIVE', 'OVERDUE'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  return {
    totalClients,
    activeLoans,
    overdueLoans,
    loansDueToday,
    totalLoanAmount: totalLoanAmountAgg[0]?.total || 0,
  };
};

const getOverdue = async () => {
  const loans = await Loan.find({ status: 'OVERDUE' })
    .sort({ updatedAt: -1 })
    .populate('clientId', 'name phone');

  return Promise.all(
    loans.map(async (loan) => {
      const firstOverdue = await RepaymentSchedule.findOne({ loanId: loan._id, status: 'OVERDUE' }).sort({ dueDate: 1 });
      return {
        loanId: loan._id,
        clientName: loan.clientId?.name,
        clientPhone: loan.clientId?.phone,
        loanAmount: loan.amount,
        totalRepayable: loan.totalRepayable,
        dueDate: firstOverdue?.dueDate || null,
        status: loan.status,
      };
    })
  );
};

const getRecentLoans = async (limit = 10) =>
  Loan.find().sort({ createdAt: -1 }).limit(limit)
    .populate('clientId', 'name phone');

module.exports = { getStats, getOverdue, getRecentLoans };
