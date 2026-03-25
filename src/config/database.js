// src/config/database.js

const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error.message);
    // Dans un environnement serverless (Vercel), on ne veut pas process.exit(1)
    if (process.env.NODE_ENV !== 'production') {
       // process.exit(1); 
    }
    throw error;
  }
};

module.exports = connectDB;
