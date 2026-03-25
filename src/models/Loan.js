// src/models/Loan.js

const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // en mois
    },
    interest: {
      type: Number,
      required: true, // calculé automatiquement
    },
    totalRepayable: {
      type: Number,
      required: true, // calculé automatiquement
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'OVERDUE'],
      default: 'ACTIVE',
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuel : calendrier du prêt
loanSchema.virtual('schedule', {
  ref: 'RepaymentSchedule',
  localField: '_id',
  foreignField: 'loanId',
});

// Virtuel : paiements du prêt
loanSchema.virtual('repayments', {
  ref: 'Repayment',
  localField: '_id',
  foreignField: 'loanId',
});

module.exports = mongoose.model('Loan', loanSchema);
