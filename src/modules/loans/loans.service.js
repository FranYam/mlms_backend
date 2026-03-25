// src/modules/loans/loans.service.js

const Loan = require('../../models/Loan');
const Client = require('../../models/Client');
const RepaymentSchedule = require('../../models/RepaymentSchedule');
const { NotFoundError, ValidationError } = require('../../utils/errors');
const { calculateInterest, generateSchedule } = require('./loans.helper');

const getAll = async () =>
  Loan.find().sort({ createdAt: -1 })
    .populate('clientId', 'name phone')
    .populate('createdById', 'name');

const getById = async (id) => {
  const loan = await Loan.findById(id)
    .populate('clientId')
    .populate('createdById', 'name')
    .populate({ path: 'schedule', options: { sort: { monthNumber: 1 } } })
    .populate({ path: 'repayments', options: { sort: { paidAt: -1 } } });
  if (!loan) throw new NotFoundError('Prêt');
  return loan;
};

const getSchedule = async (id) => {
  const loan = await Loan.findById(id);
  if (!loan) throw new NotFoundError('Prêt');
  return RepaymentSchedule.find({ loanId: id }).sort({ monthNumber: 1 });
};

const getOverdue = async () =>
  Loan.find({ status: 'OVERDUE' }).sort({ updatedAt: -1 })
    .populate('clientId', 'name phone');

const getByClient = async (clientId) => {
  const client = await Client.findById(clientId);
  if (!client) throw new NotFoundError('Client');
  return Loan.find({ clientId }).sort({ createdAt: -1 })
    .populate({ path: 'schedule', options: { sort: { monthNumber: 1 } } });
};

const getMyLoan = async (clientId) => {
  if (!clientId) throw new ValidationError('Aucun clientId associé à cet utilisateur');
  return Loan.find({ clientId }).sort({ createdAt: -1 })
    .populate({ path: 'schedule', options: { sort: { monthNumber: 1 } } })
    .populate({ path: 'repayments', options: { sort: { paidAt: -1 } } });
};

const create = async ({ clientId, amount, interestRate, duration }, createdById) => {
  const client = await Client.findById(clientId);
  if (!client) throw new NotFoundError('Client');

  const { interest, totalRepayable } = calculateInterest(amount, interestRate);
  const startDate = new Date();

  const loan = await Loan.create({ clientId, amount, interestRate, duration, interest, totalRepayable, startDate, createdById });

  const scheduleData = generateSchedule(loan._id, totalRepayable, duration, startDate);
  await RepaymentSchedule.insertMany(scheduleData);

  return Loan.findById(loan._id)
    .populate('clientId', 'name phone')
    .populate({ path: 'schedule', options: { sort: { monthNumber: 1 } } });
};

const updateStatus = async (id, status) => {
  const loan = await Loan.findById(id);
  if (!loan) throw new NotFoundError('Prêt');
  return Loan.findByIdAndUpdate(id, { status }, { new: true });
};

module.exports = { getAll, getById, getSchedule, getOverdue, getByClient, getMyLoan, create, updateStatus };
