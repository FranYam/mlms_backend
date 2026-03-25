// src/server.js

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const cron = require('node-cron');
const Loan = require('./models/Loan');
const RepaymentSchedule = require('./models/RepaymentSchedule');

const PORT = process.env.PORT || 3000;

// ─── CRON : Détection des retards — tous les jours à minuit ──────────────────
cron.schedule('0 0 * * *', async () => {
  console.log('⏰ CRON : Vérification des prêts en retard...');
  try {
    const now = new Date();

    const updated = await RepaymentSchedule.updateMany(
      { status: 'PENDING', dueDate: { $lt: now } },
      { status: 'OVERDUE' }
    );

    const overdueSchedules = await RepaymentSchedule.distinct('loanId', { status: 'OVERDUE' });

    if (overdueSchedules.length > 0) {
      await Loan.updateMany(
        { _id: { $in: overdueSchedules }, status: 'ACTIVE' },
        { status: 'OVERDUE' }
      );
    }

    console.log(`✅ CRON : ${updated.modifiedCount} échéance(s) → OVERDUE, ${overdueSchedules.length} prêt(s) affecté(s)`);
  } catch (err) {
    console.error('❌ Erreur CRON :', err.message);
  }
});

// ─── Démarrage ────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║       MLMS Backend (MongoDB) — Démarré !             ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log(`║  🚀 Serveur    : http://localhost:${PORT}              ║`);
    console.log(`║  📖 Swagger UI : http://localhost:${PORT}/api-docs     ║`);
    console.log(`║  🍃 Base       : MongoDB                              ║`);
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('');
  });
};

start();
