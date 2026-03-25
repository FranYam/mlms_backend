// src/models/RepaymentSchedule.js

const mongoose = require('mongoose');

const repaymentScheduleSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
      required: true,
    },
    monthNumber: {
      type: Number,
      required: true,
    },
    amountDue: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'OVERDUE'],
      default: 'PENDING',
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.model('RepaymentSchedule', repaymentScheduleSchema);
