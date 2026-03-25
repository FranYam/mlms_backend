// src/models/Repayment.js

const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
      required: true,
    },
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RepaymentSchedule',
      default: null,
      set: v => v === "" ? null : v
    },
    amount: {
      type: Number,
      required: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: null,
    },
    recordedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model('Repayment', repaymentSchema);
