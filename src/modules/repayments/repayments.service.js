// src/modules/repayments/repayments.service.js

const Loan = require('../../models/Loan');
const Repayment = require('../../models/Repayment');
const RepaymentSchedule = require('../../models/RepaymentSchedule');
const { NotFoundError, ValidationError } = require('../../utils/errors');

const getByLoan = async (loanId) => {
  const loan = await Loan.findById(loanId);
  if (!loan) throw new NotFoundError('Prêt');
  return Repayment.find({ loanId }).sort({ paidAt: -1 })
    .populate('scheduleId', 'monthNumber dueDate')
    .populate('recordedById', 'name');
};

const getPending = async (loanId) => {
  const loan = await Loan.findById(loanId);
  if (!loan) throw new NotFoundError('Prêt');
  return RepaymentSchedule.find({ loanId, status: { $in: ['PENDING', 'OVERDUE'] } }).sort({ monthNumber: 1 });
};

const record = async ({ loanId, scheduleId, amount, note }, recordedById) => {
  const loan = await Loan.findById(loanId);
  if (!loan) throw new NotFoundError('Prêt');
  if (loan.status === 'COMPLETED') throw new ValidationError('Ce prêt est déjà soldé');

  if (scheduleId) {
    const schedule = await RepaymentSchedule.findById(scheduleId);
    if (!schedule || String(schedule.loanId) !== String(loanId)) throw new NotFoundError('Échéance');
    if (schedule.status === 'PAID') throw new ValidationError('Cette échéance est déjà payée');
    await RepaymentSchedule.findByIdAndUpdate(scheduleId, { status: 'PAID' });
  }

  const repayment = await Repayment.create({ loanId, scheduleId: scheduleId || null, amount, note, recordedById });

  // Calculer total payé
  const agg = await Repayment.aggregate([
    { $match: { loanId: loan._id } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalPaid = agg[0]?.total || 0;

  if (totalPaid >= loan.totalRepayable) {
    await Loan.findByIdAndUpdate(loanId, { status: 'COMPLETED' });
    await RepaymentSchedule.updateMany({ loanId, status: { $ne: 'PAID' } }, { status: 'PAID' });
  }

  return repayment;
};

module.exports = { getByLoan, getPending, record };
