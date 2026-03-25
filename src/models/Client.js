// src/models/Client.js

const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Le téléphone est requis'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "L'adresse est requise"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'registeredAt', updatedAt: 'updatedAt' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuel : liste des prêts du client
clientSchema.virtual('loans', {
  ref: 'Loan',
  localField: '_id',
  foreignField: 'clientId',
});

module.exports = mongoose.model('Client', clientSchema);
