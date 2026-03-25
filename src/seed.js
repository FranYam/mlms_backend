// src/seed.js
// Exécuter avec : npm run seed

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Client = require('./models/Client');
const Loan = require('./models/Loan');
const RepaymentSchedule = require('./models/RepaymentSchedule');
const { generateSchedule, calculateInterest } = require('./modules/loans/loans.helper');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connecté');

  // Nettoyer
  await Promise.all([
    User.deleteMany(),
    Client.deleteMany(),
    Loan.deleteMany(),
    RepaymentSchedule.deleteMany(),
  ]);
  console.log('🧹 Collections nettoyées');

  // Admin
  const admin = await User.create({
    name: 'Administrateur',
    email: 'admin@mlms.com',
    password: 'secret123',
    role: 'ADMIN',
  });

  // Loan Officer
  await User.create({
    name: 'Fatou Diallo',
    email: 'officer@mlms.com',
    password: 'secret123',
    role: 'LOAN_OFFICER',
  });

  // Clients
  const client1 = await Client.create({
    name: 'Ali Traoré',
    phone: '+226 70 00 00 01',
    address: 'Ouagadougou, Secteur 15',
    email: 'ali@example.com',
  });

  await Client.create({
    name: 'Mariam Ouédraogo',
    phone: '+226 76 00 00 02',
    address: 'Bobo-Dioulasso, Zone commerciale',
  });

  // Compte CLIENT pour Ali
  await User.create({
    name: 'Ali Traoré',
    email: 'ali.client@mlms.com',
    password: 'secret123',
    role: 'CLIENT',
    clientId: client1._id,
  });

  // Prêt pour Ali
  const amount = 100000, rate = 10, duration = 12;
  const { interest, totalRepayable } = calculateInterest(amount, rate);
  const startDate = new Date();

  const loan = await Loan.create({
    clientId: client1._id,
    amount, interestRate: rate, duration,
    interest, totalRepayable,
    startDate, status: 'ACTIVE',
    createdById: admin._id,
  });

  const scheduleData = generateSchedule(loan._id, totalRepayable, duration, startDate);
  await RepaymentSchedule.insertMany(scheduleData);

  console.log('');
  console.log('✅ Seed terminé !');
  console.log('── Comptes de test ──────────────────────────────────────');
  console.log('  Admin        : admin@mlms.com       / secret123');
  console.log('  Loan Officer : officer@mlms.com     / secret123');
  console.log('  Client (Ali) : ali.client@mlms.com  / secret123');
  console.log('─────────────────────────────────────────────────────────');

  await mongoose.disconnect();
};

seed().catch((e) => { console.error('❌', e.message); process.exit(1); });
