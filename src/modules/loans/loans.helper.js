// src/modules/loans/loans.helper.js

const calculateInterest = (amount, interestRate) => {
  const interest = amount * (interestRate / 100);
  const totalRepayable = amount + interest;
  return { interest, totalRepayable };
};

const generateSchedule = (loanId, totalRepayable, duration, startDate) => {
  const monthlyAmount = Math.round(totalRepayable / duration);
  const schedule = [];
  for (let i = 1; i <= duration; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    const isLast = i === duration;
    const amountDue = isLast ? totalRepayable - monthlyAmount * (duration - 1) : monthlyAmount;
    schedule.push({ loanId, monthNumber: i, amountDue, dueDate, status: 'PENDING' });
  }
  return schedule;
};

module.exports = { calculateInterest, generateSchedule };
