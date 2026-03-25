// src/modules/auth/auth.service.js

const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { UnauthorizedError, NotFoundError } = require('../../utils/errors');

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new UnauthorizedError('Email ou mot de passe incorrect');
  if (user.status === 'INACTIVE') throw new UnauthorizedError("Compte désactivé. Contactez l'administrateur.");

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new UnauthorizedError('Email ou mot de passe incorrect');

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, clientId: user.clientId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, clientId: user.clientId },
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new NotFoundError('Utilisateur');
  return user;
};

module.exports = { login, getMe };
